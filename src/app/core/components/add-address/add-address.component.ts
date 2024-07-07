import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICities } from '../../../features/authentication/models/icities';
import { GenericServiceService } from 'src/app/core/services/generic-service.service';
import { IContactAddress } from '../../../features/authentication/models/icontactaddress';
import { AddressService } from '../../../features/authentication/services/address.service';
import { IMapPolygonData } from '../../../features/authentication/models/imap-polygon-data';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {
  //form properties
  addressForm!: FormGroup;

  allCities?: ICities;

  cityDistracts?: ICities;

  houseTypes?: ICities;

  districtAndCitySelected = false;

  houseFloors?: ICities;

  //map properties
  polygonPaths: google.maps.LatLngLiteral[] = [];

  constructor(private fb: FormBuilder,
    private addressGenericService: GenericServiceService<IContactAddress>,
    private addressService: AddressService
  ) { }

  //life cycle hooks
  ngOnInit(): void {
    this.initializeForm();
    this.getAllCities();
  }

  //observers
  getAllCitiesObserver = {
    next: (cities: ICities) => {
      this.allCities = cities;
    },
    error: (err: Error) => {
      console.log(err);
    }
  }

  getCityDistractsObserver = {
    next: (cities: ICities) => {
      this.cityDistracts = cities;
      this.getControl('districtId')?.setValue('-1');
    },
    error: (err: Error) => {
      console.log(err);
    }
  }

  getHouseTypesObserver = {
    next: (cities: ICities) => {
      this.houseTypes = cities;
    },
    error: (err: Error) => {
      console.log(err);
    }
  }

  getHouseFloorsObserver = {
    next: (cities: ICities) => {
      this.houseFloors = cities;
    },
    error: (err: Error) => {
      console.log(err);
    }
  }

  displayDistrictPositionOnMapObserver = {
    next: (data: IMapPolygonData) => {
      console.log(data);
      this.polygonPaths = JSON.parse(data.data);
    },
    error: (err: Error) => {
      console.log(err);
    }
  }

  //methods
  displayOtherAddressControls(show: boolean) {
    this.districtAndCitySelected = show;
  }
  onCityChange() {
    this.showOrDisplayOtherAddressControls();
    this.getCityDistracts(this.getControl('cityId')?.value);
  }
  onDistrictChange() {
    this.displayDistrictPositionOnMap(this.getControl('districtId')?.value);
    this.showOrDisplayOtherAddressControls();
    this.getHouseTypes();
    this.getHouseFloors();
  }

  displayDistrictPositionOnMap(districtId: string) {
    this.addressGenericService.getAll<IMapPolygonData>("City/GetPolygonPath?districtId=" + districtId).subscribe(this.displayDistrictPositionOnMapObserver)
  }

  showOrDisplayOtherAddressControls() {
    if (this.getControl("districtId")?.value
        && this.getControl("cityId")?.value) {
          this.displayOtherAddressControls(true);
    } else {
      this.displayOtherAddressControls(false);
    }
  }
  getAllCities() {
    if (!this.allCities || this.getControl('cityId')?.value) {
      this.addressGenericService.getAll<ICities>("City/ActiveCities").subscribe(this.getAllCitiesObserver)
    }
  }
  getCityDistracts(cityId: string) {
    this.addressService.getAllCityDitracts(cityId).subscribe(this.getCityDistractsObserver);
  }

  getHouseTypes() {
    this.addressGenericService.getAll<ICities>("ContactAddress/HousingTypes").subscribe(this.getHouseTypesObserver)
  }

  getHouseFloors() {
    this.addressGenericService.getAll<ICities>("ContactAddress/HousingFloors").subscribe(this.getHouseFloorsObserver)
  }

  onHouseTypeChange() {
    if (this.getControl("houseType")?.value == 1) {
      this.getControl("apartmentNo")?.setValidators([Validators.required]);
      this.getControl("aprtmentNo")?.updateValueAndValidity();
    } else {
      this.getControl("apartmentNo")?.removeValidators([Validators.required]);
      this.getControl("aprtmentNo")?.updateValueAndValidity();
    }
  }

  initializeForm() {
    this.addressForm = this.fb.group({
      contactId: ["", [Validators.required]],
      locationId: ["", [Validators.required]],
      houseNo: ["", [Validators.required]],
      houseType: ["", [Validators.required]],
      floorNo: ["", [Validators.required]],
      apartmentNo: [""],
      cityId: ["", [Validators.required]],
      districtId: ["", [Validators.required]],
      latitude: ["", [Validators.required]],
      longitude: ["", [Validators.required]],
      addressNotes: ["", [Validators.required]],
      type: ["", [Validators.required]],
    })
  }

  submitAddress() {
    console.log(this.addressForm.value);
  }

  //getters
  getControl(controlName: string) {
    return this.addressForm.get(controlName);
  }

}
