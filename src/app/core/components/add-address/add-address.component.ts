import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICities } from '../../../features/authentication/models/icities';
import { GenericServiceService } from 'src/app/core/services/generic-service.service';
import { IContactAddress } from '../../services/icontactaddress';
import { AddressService } from '../../../features/authentication/services/address.service';
import { IMapPolygonData } from '../../../features/authentication/models/imap-polygon-data';
import { IFullAddressInfo } from '../../models/add-address/ifull-address-info';
import { AuthenticationService } from 'src/app/features/authentication/services/authentication.service';
import { ILoginReturnData } from 'src/app/features/authentication/models/ilogin-return-data';
import { IContactSavedAddressResponse } from '../../models/add-address/icontact-saved-address-response';

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

  contactId!: string;

  //map properties
  polygonPaths: google.maps.LatLngLiteral[] = [];

  constructor(private fb: FormBuilder,
    private addressGenericService: GenericServiceService<IContactAddress>,
    private addressService: AddressService,
    private authService: AuthenticationService
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

  insertAddressObserver = {
    next: (data: IContactAddress) => {
      console.log(data);
    },
    error: (err: Error) => {
      console.log(err);
    }
  }

  setTypeValueObserver = {
    next: (data: IContactSavedAddressResponse) => {
      console.log(data);
      this.setType1Or2(data);
    },
    error: (err: Error) => {
      console.log(err);
    }
  }
  //methods
  setType1Or2(data: IContactSavedAddressResponse) {
    if (data.data.mainLocations?.cityId) {
      this.getControl("type")?.setValue(2);
    } else {
      this.getControl("type")?.setValue(1);
    }
  }

  setContactId() {
    this.authService.loggedInSubject.subscribe((res: ILoginReturnData | null) => {
      this.contactId = res?.data.user.crmUserId || '';
      this.addressForm.get('contactId')?.setValue(this.contactId);
      this.setTypeValue();
    })
  }
  displayOtherAddressControls(show: boolean) {
    this.districtAndCitySelected = show;
  }
  onCityChange() {
    this.setCityName();
    this.showOrDisplayOtherAddressControls();
    this.getCityDistracts(this.getControl('cityId')?.value);
  }
  setCityName() {
    const selectedCity = this.allCities?.data.find(c => c.key == this.getControl("cityId")?.value);
    this.addressForm.get("cityName")!.setValue(selectedCity ? selectedCity.value : '');
  }
  onDistrictChange() {
    this.setDistractName();
    this.displayDistrictPositionOnMap(this.getControl('districtId')?.value);
    this.showOrDisplayOtherAddressControls();
    this.getHouseTypes();
    this.getHouseFloors();
  }

  setDistractName() {
    const selectedDistrict = this.cityDistracts?.data.find(d => d.key == this.getControl("districtId")?.value);
    this.getControl("districtName")!.setValue(selectedDistrict ? selectedDistrict.value : '');
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
      this.setHouseTypeText("عمارة");
      this.displayApartmentNo(true);
    } else {
      this.displayApartmentNo(false);
      this.setHouseTypeText("فيلا");
    }
  }

  setTypeValue() {
    if (this.contactId) {
      this.addressGenericService.getAll<IContactSavedAddressResponse>("SavedContactLocation/ContactSavedAddress?contactId=" + this.contactId).subscribe(this.setTypeValueObserver);
    }
  }

  displayApartmentNo(display: boolean) {
    if (display) {
      this.getControl("apartmentNo")?.setValidators([Validators.required]);
      this.getControl("aprtmentNo")?.updateValueAndValidity();
    } else {
      this.getControl("apartmentNo")?.removeValidators([Validators.required]);
      this.getControl("aprtmentNo")?.updateValueAndValidity();
    }
  }

  setHouseTypeText(houseTypeText: string) {
    this.getControl("houseTypeText")?.setValue(houseTypeText);
  }

  initializeForm() {
    this.addressForm = this.fb.group({
      houseNo: [null, [Validators.required]],
      houseType: [null, [Validators.required]],
      floorNo: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      districtId: [null, [Validators.required]],
      latitude: [null, [Validators.required]],
      longitude: [null, [Validators.required]],
      type: [null, [Validators.required]],
      cityName: [null, [Validators.required]],
      districtName: [null, [Validators.required]],
      houseNumber: [null],
      houseTypeText: [null, [Validators.required]],
      contactId: [null, [Validators.required]],
    })

    this.setContactId();
  }
  

  onFullAddressChange(event: IFullAddressInfo) {
    if (event) {
      this.getControl("latitude")?.setValue(event.latitute);
      this.getControl("longitude")?.setValue(event.longitude);
    }
  }

  onHouseNumberChange() {
    this.getControl("houseNumber")?.setValue(this.getControl("houseNo")?.value);
  }

  submitAddress() {
    this.createInsertAddressHeaders();
    let addressModel: IContactAddress = this.mapFormDataToFullAddressModel();
    this.insertAddress(addressModel);
  }

  createInsertAddressHeaders() {
    this.addressGenericService.addHeaders("Content-Type", "application/json");
  }

  mapFormDataToFullAddressModel(): IContactAddress{
    let addressModel: IContactAddress = this.addressForm.value as IContactAddress; 
    return addressModel;
  }

  insertAddress(addressModel: IContactAddress) {
    this.addressGenericService.insert("ContactAddress/AddNewAddress", addressModel).subscribe(this.insertAddressObserver);

  }

  //getters
  getControl(controlName: string) {
    return this.addressForm.get(controlName);
  }

  printForm() {
    console.log(this.addressForm.value);
  }
}
