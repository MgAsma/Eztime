import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiserviceService {
  baseurl = environment.live_url;
  newUrl = environment.new_dev_url;
  org_id: any;
  accessArr: any = []
  token: any
  headers: any;
  constructor(private http: HttpClient, private toastr: ToastrService) { }
  ngOnInit() {
    this.token = sessionStorage.getItem('token')
    this.org_id = sessionStorage.getItem('org_id')
    // this.headers = {'Authorization':this.token} 
  }


  // Success Message
  showSuccess(message: any) {
    this.toastr.success(message);

  }
  // Error Message
  showError(message: any) {
    this.toastr.error(message);
  }
  // Warning Message
  showWarning(message: any) {
    this.toastr.warning(message);
  }
  // Login
  // loginDetails(data: any) {
  //   return this.http.post(`${this.baseurl}/login`, data)
  // }
  loginDetails(data: any) {
    return this.http.post(`${this.baseurl}/login/`, data)
  }
  userAccess(user_id:any){
    return this.http.get(`${this.baseurl}/user-access/${user_id}/`)
  }
  // Login
  //Register
  register(data: any) {
    return this.http.post(`${this.baseurl}/register`, data, { headers: this.headers })
  }
  //Register
  // Forgot Password
  ForgotPasswordDetails(data: any) {
    return this.http.post(`${this.baseurl}/forgot-password-send-otp`, data, { headers: this.headers })
  }
  // Forgot Password
  // Otp
  otp(data: any) {
    return this.http.post(`${this.baseurl}/otp-verify-forgot-pass`, data, { headers: this.headers })
  }
  // Otp
  // Reset Forgot Password
  resetPassword(data: any) {
    return this.http.post(`${this.baseurl}/password-reset`, data, { headers: this.headers })
  }
  // Reset Forgot Password

  // dashboard
  getCount(data, token) {
    return this.http.post(`${this.baseurl}/dash-board`, data)
  }
  // dashboard

  // ORG--Roles
  addRoleDetails(data: any) {
    return this.http.post(`${this.baseurl}/organization-roles`, data, { headers: this.headers })
  }

  getRoleDetailsPage(params) {
    return this.http.get(`${this.baseurl}/organization-roles?${params}`, { headers: this.headers })
  }

  deleteRoleDetails(id: any) {
    return this.http.delete(`${this.baseurl}/organization-roles/${id}`, { headers: this.headers })
  }
  getCurrentRoleDetails(id: any, params) {
    return this.http.get(`${this.baseurl}/organization-roles?id=${id}&page_number=${params.page_number}&data_per_page=${params.data_per_page}`, { headers: this.headers })
  }
  updateRole(id: any, data: any) {
    return this.http.put(`${this.baseurl}/organization-roles/${id}`, data, { headers: this.headers })
  }
  // Roles
  // Department
  addDepartmentDetails(data: any) {
    return this.http.post(`${this.baseurl}/organization-department`, data, { headers: this.headers })
  }
  getDepartmentDetails(params, org) {
    return this.http.get(`${this.baseurl}/organization-department?page_number=1&data_per_page=2&pagination=${params.pagination}&org_ref_id=${org}`, { headers: this.headers })
  }
  getDepartmentDetailsPage(params) {
    return this.http.get(`${this.baseurl}/organization-department?${params}`, { headers: this.headers })
  }
  deleteDepartmentDetails(id: any) {
    return this.http.delete(`${this.baseurl}/organization-department/${id}`, { headers: this.headers })
  }
  getCurrentDepartmentDetails(id: any, params) {
    return this.http.get(`${this.baseurl}/organization-department?id=${id}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&org_ref_id=${params.org_ref_id}&pagination=FALSE`, { headers: this.headers })
  }
  updateDepartmant(id: any, data: any) {
    return this.http.put(`${this.baseurl}/organization-department/${id}`, data, { headers: this.headers })
  }
  // Department 

  // Industry Sector
  addIndustryDetails(data: any) {
    return this.http.post(`${this.baseurl}/type-of-industries`, data, { headers: this.headers })
  }
  getIndustryDetails(params) {
    return this.http.get(`${this.baseurl}/type-of-industries?page_number=1&data_per_page=2&pagination=${params.pagination}&org_ref_id=${params.org_ref_id}`, { headers: this.headers })
  }
  getIndustryDetailsPage(params) {
    return this.http.get(`${this.baseurl}/type-of-industries?search_key=${params.search_key}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&org_ref_id=${params.org_ref_id}&pagination=${params.pagination}`, { headers: this.headers })
  }
  deleteIndustryDetails(id: any) {
    return this.http.delete(`${this.baseurl}/type-of-industries/${id}`, { headers: this.headers })
  }
  getCurrentIndustryDetails(id: any, params) {
    return this.http.get(`${this.baseurl}/type-of-industries?id=${id}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&pagination=${params.pagination}&org_ref_id=${params.org_ref_id}`, { headers: this.headers })
  }
  updateIndustry(id: any, data: any) {
    return this.http.put(`${this.baseurl}/type-of-industries/${id}`, data, { headers: this.headers })
  }
  // Industry Sector

  // Client
  
  // addClientDetails(data: any) {
  //   return this.http.post(`${this.baseurl}/clients`, data, { headers: this.headers })
  // }
 
  getClientDetails(params, org) {
    return this.http.get(`${this.baseurl}/clients?page_number=1&data_per_page=2&pagination=${params.pagination}&org_ref_id=${org}`, { headers: this.headers })
  }
  getClientDetailsPage(params) {
    return this.http.get(`${this.baseurl}/clients?page_number=${params.page_number}&data_per_page=${params.data_per_page}`, { headers: this.headers })
  }
  deleteClientDetails(id: any) {
    return this.http.delete(`${this.baseurl}/clients/${id}`, { headers: this.headers })
  }
  getCurrentClientDetails(id: any, params) {
    return this.http.get(`${this.baseurl}/clients?id=${id}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&pagination=TRUE&org_ref_id=${params.org_ref_id}`, { headers: this.headers })
  }
  updateClient(id: any, data: any) {
    return this.http.put(`${this.baseurl}/clients/${id}`, data, { headers: this.headers })
  }

  // ================= new pi for client
  addClientDetails(data: any) {
    return this.http.post(`${this.baseurl}/client/`, data, { headers: this.headers })
  }
  getClientListFromUserId(){
    return this.http.get(`${this.baseurl}/client/`, { headers: this.headers })
  }
  deleteClient(id: any) {
    return this.http.delete(`${this.baseurl}/client/${id}/`, { headers: this.headers })
  }
  getCurrentClient(id: any) {
    return this.http.get(`${this.baseurl}/client/${id}/`, { headers: this.headers })
  }
  updateClientList(id: any, data: any) {
    return this.http.put(`${this.baseurl}/client/${id}/`, data, { headers: this.headers })
  }
  // =================== Client

  // Project- Status
  // Sub Category
  addSubCategoryDetails(data: any) {
    return this.http.post(`${this.baseurl}/project-status-sub-category`, data, { headers: this.headers })
  }
  getSubCategoryDetails(params) {
    return this.http.get(`${this.baseurl}/project-status-sub-category?page_number=1&data_per_page=2&pagination=${params.pagination}`, { headers: this.headers })
  }
  getSubCategoryDetailsPage(params) {
    return this.http.get(`${this.baseurl}/project-status-sub-category?page_number=${params.page_number}&data_per_page=${params.data_per_page}
    `, { headers: this.headers })
  }
  deleteSubCategoryDetails(id: any) {
    return this.http.delete(`${this.baseurl}/project-status-sub-category/${id}`, { headers: this.headers })
  }
  getCurrentSubCategoryDetails(id: any, params) {
    return this.http.get(`${this.baseurl}/project-status-sub-category?id=${id}&page_number=${params.page_number}&data_per_page=${params.data_per_page}`, { headers: this.headers })
  }
  updateSubCategory(id: any, data: any) {
    return this.http.put(`${this.baseurl}/project-status-sub-category/${id}`, data, { headers: this.headers })
  }
  // Sub Category
  // Main Category
  addMainCategoryDetails(data: any) {
    return this.http.post(`${this.baseurl}/project-status-main-category`, data, { headers: this.headers })
  }
  getMainCategoryDetails(params) {
    return this.http.get(`${this.baseurl}/project-status-main-category?page_number=1&data_per_page=2&pagination=${params.pagination}`, { headers: this.headers })
  }
  getMainCategoryDetailsPage(params) {
    return this.http.get(`${this.baseurl}/project-status-main-category?page_number=${params.page_number}&data_per_page=${params.data_per_page}`, { headers: this.headers })
  }
  deleteMainCategoryDetails(id: any) {
    return this.http.delete(`${this.baseurl}/project-status-main-category/${id}`, { headers: this.headers })
  }
  getCurrentMainCategoryDetails(id: any, params) {
    return this.http.get(`${this.baseurl}/project-status-main-category?id=${id}&page_number=${params.page_number}&data_per_page=${params.data_per_page}`, { headers: this.headers })
  }
  updateMainCategory(id: any, data: any) {
    return this.http.put(`${this.baseurl}/project-status-main-category/${id}`, data, { headers: this.headers })
  }
  // Main Category
  // Project- Status

  // Project
  addProjectDetails(data: any) {
    return this.http.post(`${this.baseurl}/projects`, data, { headers: this.headers })
  }
  getProjectDetails(params) {
    return this.http.get(`${this.baseurl}/projects?page_number=1&data_per_page=2&pagination=${params.pagination}`, { headers: this.headers })
  }
  getProjectDetailsPage(params) {
    return this.http.get(`${this.baseurl}/projects?user_id=${params.user_id}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&pagination=TRUE&organization_id=${params.organization_id}`, { headers: this.headers })
  }
  getProjectDetailsByClientId(id: any) {
    return this.http.get(`${this.baseurl}/projectbyclients/?client_id=${id}`, { headers: this.headers })
  }
  deleteProjectDetails(id: any) {
    return this.http.delete(`${this.baseurl}/projects/${id}`, { headers: this.headers })
  }
  getCurrentProjectDetails(id: any, params) {
    return this.http.get(`${this.baseurl}/projects?id=${id}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&pagination=TRUE&organization_id=${params.organization_id}`, { headers: this.headers })
  }
  updateProject(id: any, data: any) {
    return this.http.put(`${this.baseurl}/projects/${id}`, data, { headers: this.headers })
  }
  // Project

  //reporting/Aprrover manager
  getManagerDetails(params, orgId) {
    //return this.http.get(`${this.baseurl}/profile-custom-user?page_number=1&data_per_page=2&pagination=${params.pagination}`,{headers:this.headers})
    return this.http.get(`${this.baseurl}/profile-custom-user?page_number=1&data_per_page=2&pagination=${params.pagination}&organization_id=${orgId}`, { headers: this.headers })
  }
  //reporting/Aprrover manager

  //People group
  getPeopleGroupDetails() {
    return this.http.get(`${this.baseurl}/org-people-group?page_number=1&data_per_page=2&pagination=FALSE`, { headers: this.headers })
  }
  //People group

  // Leave/Holiday List
  addLeaveDetails(data: any) {
    return this.http.post(`${this.baseurl}/leave-application`, data, { headers: this.headers })
  }
  getLeaveDetails() {
    return this.http.get(`${this.baseurl}/leave-application`, { headers: this.headers })
  }
  deleteLeaveDetails(id: any) {
    return this.http.delete(`${this.baseurl}/leave-application/${id}`, { headers: this.headers })
  }
  // Leave/Holiday List

  //time Sheet master 
  addTimeSheetDetails(data: any) {
    return this.http.post(`${this.baseurl}/time-sheet`, data, { headers: this.headers })
  }
  getTimeSheetDetails() {
    return this.http.get(`${this.baseurl}/time-sheet`, { headers: this.headers })
  }
  deleteTimeSheeteDetails(id: any, params) {
    return this.http.delete(`${this.baseurl}/time-sheets/${id}?module=${params.module}&menu=${params.menu}&method=${params.method}&user_id=${params.user_id}`, { headers: this.headers })
  }
  //time Sheet master 

  //Leave Details
  addLeaveTypeDetails(data: any) {
    return this.http.post(`${this.baseurl}/master-leave-types`, data, { headers: this.headers })
  }
  getLeaveDetail(params) {
    return this.http.get(`${this.baseurl}/master-leave-types?search_key=${params.search_key}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&pagination=TRUE&organization_id=${params.organization_id}`, { headers: this.headers })
  }
  getLeaveTypeDetails(params) {
    return this.http.get(`${this.baseurl}/master-leave-types?page_number=1&data_per_page=2&pagination=FALSE&organization_id=${params.orgId}&center_id=${params.center_id}`, { headers: this.headers })
  }
  deleteLeaveTypeDetails(id: any) {
    return this.http.delete(`${this.baseurl}/master-leave-types/${id}?page_number=1&data_per_page=2&pagination=FALSE`, { headers: this.headers })
  }
  getCurrentLeaveTypeDetails(id: any, org: any) {
    return this.http.get(`${this.baseurl}/master-leave-types?id=${id}&page_number=1&data_per_page=2&pagination=FALSE&organization_id=${org}`, { headers: this.headers })
  }
  updateLeaveTypeCategory(id: any, data: any) {
    return this.http.put(`${this.baseurl}/master-leave-types/${id}`, data, { headers: this.headers })
  }
  //Leave Details

  // Project Task Category 
  addProjectTaskCategoryDetails(data: any) {
    return this.http.post(`${this.baseurl}/task-project-categories`, data, { headers: this.headers })
  }
  getProjectTaskCategoryDetails(params) {
    return this.http.get(`${this.baseurl}/task-project-categories?page_number=1&data_per_page=2&pagination=${params.pagination}`, { headers: this.headers })
  }
  getProjectTaskCategoryDetailsByProjectId(id: any) {
    return this.http.get(`${this.baseurl}/taskbyprojects/?project_id=${id}`, { headers: this.headers })
  }
  getTimeSpent() {
    return this.http.get(`${this.baseurl}/timespent/`)
  }
  getProjectTaskCategoryDetailsPage(params) {
    return this.http.get(`${this.baseurl}/task-project-categories?search_key=${params.search_key}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&org_ref_id=${params.org_ref_id}&pagination=TRUE`, { headers: this.headers })
  }
  getSubTaskByProjectTaskCategory(id: any, params) {
    return this.http.get(`${this.baseurl}/task-project-categories?id=${id}&page_number=1&data_per_page=10&pagination=FALSE&org_ref_id=${params}`, { headers: this.headers })
  }
  deleteProjectTaskCategoryDetails(id: any) {
    return this.http.delete(`${this.baseurl}/task-project-categories/${id}`, { headers: this.headers })
  }
  getCurrentProjectTaskCategoryDetails(id: any, params) {
    return this.http.get(`${this.baseurl}/task-project-categories?id=${id}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&pagination=TRUE&org_ref_id=${params.org_ref_id}`, { headers: this.headers })
  }
  updateProjectTaskCategory(id: any, data: any) {
    return this.http.put(`${this.baseurl}/task-project-categories/${id}`, data, { headers: this.headers })
  }

  // Project Task Category 


  // new project category
  postProjCategory(data:any){
    return this.http.post(`${this.baseurl}/project_category/`,data,{ headers: this.headers })
  }
  getProjCategory(){
    return this.http.get(`${this.baseurl}/project_category/`,{ headers: this.headers })
  }
  getProjCategoryById(id:any){
    return this.http.get(`${this.baseurl}/project_category/${id}/`,{ headers: this.headers })
  }
  putProjCategory(id:any,data:any){
    return this.http.put(`${this.baseurl}/project_category/${id}/`,data,{ headers: this.headers })
  }
  deleteProjCategory(id:any){
    return this.http.delete(`${this.baseurl}/project_category/${id}/`,{ headers: this.headers })
  }
  // new project category ends here

  // Prefix/suffix
  addPrefixSuffixDetails(data: any) {
    return this.http.post(`${this.baseurl}/prefix-suffix`, data, { headers: this.headers })
  }
  getPrefixSuffixDetailsPage(params) {
    return this.http.get(`${this.baseurl}/prefix-suffix?search_key=${params.search_key}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&organization_id=${params.organization_id}&pagination=TRUE`, { headers: this.headers })
  }
  getPrefixSuffixDetails(params, orgId) {
    return this.http.get(`${this.baseurl}/prefix-suffix?page_number=1&data_per_page=2&pagination=${params.pagination}&organization_id=${orgId}`, { headers: this.headers })
  }
  deletePrefixSuffixDetails(id: any) {
    return this.http.delete(`${this.baseurl}/prefix-suffix/${id}`, { headers: this.headers })
  }
  getCurrentPrefixSuffixDetails(id: any, params, org) {
    return this.http.get(`${this.baseurl}/prefix-suffix?id=${id}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&pagination=${params.pagination}&organization_id=${org}`, { headers: this.headers })
  }
  updatePrefixSuffix(id: any, data: any) {
    return this.http.put(`${this.baseurl}/prefix-suffix/${id}`, data, { headers: this.headers })
  }
  // Prefix/suffix

  // Centre
  addCenterDetails(data: any) {
    return this.http.post(`${this.baseurl}/center`, data, { headers: this.headers })
  }
  getCenterDetails(params, orgId) {
    return this.http.get(`${this.baseurl}/center?page_number=1&data_per_page=2&pagination=${params.pagination}&organization_id=${orgId}`, { headers: this.headers })
  }
  getCenterDetailsPage(params) {
    return this.http.get(`${this.baseurl}/center?search_key=${params.search_key}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&pagination=${params.pagination}&organization_id=${params.organization_id}`, { headers: this.headers })
  }
  deleteCenterDetails(id: any) {
    return this.http.delete(`${this.baseurl}/center/${id}`, { headers: this.headers })
  }
  getCurrentCentreDetails(id: any, params) {
    return this.http.get(`${this.baseurl}/center?id=${id}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&pagination=${params.pagination}&organization_id=${params.organization_id}`, { headers: this.headers })
  }
  updateCentre(id: any, data: any) {
    return this.http.put(`${this.baseurl}/center/${id}`, data, { headers: this.headers })
  }
  // Centre

  // people
  addPeopleDetails(data: any) {
    return this.http.post(`${this.baseurl}/people`, data, { headers: this.headers })
  }
  getPeopleDetails(params) {
    return this.http.get(`${this.baseurl}/people?page_number=1&data_per_page=2&pagination=${params.pagination}`, { headers: this.headers })
  }
  getPeopleDetailsPage(params) {
    return this.http.get(`${this.baseurl}/people?search_key=${params.search_key}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&organization_id=${params.organization_id}&pagination=TRUE`, { headers: this.headers })
  }
  getSuperAdminPeoplePage(params) {
    return this.http.get(`${this.baseurl}/people?page_number=${params.page_number}&data_per_page=${params.data_per_page}&organization_id=${params.organization_id}&pagination=TRUE&ignore_super_admin=${params.ignore_super_admin}&search_key=${params.search_key}`, { headers: this.headers })
  }

  deletePeopleDetails(id: any) {
    return this.http.delete(`${this.baseurl}/people/${id}`, { headers: this.headers })
  }
  getCurrentPeopleDetails(id: any, params) {
    return this.http.get(`${this.baseurl}/people?id=${id}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&organization_id=${params.organization_id}&pagination=TRUE`, { headers: this.headers })
  }
  updatePeople(id: any, data: any) {
    return this.http.put(`${this.baseurl}/people/${id}`, data, { headers: this.headers })
  }
  // people

  // Tags
  addTagDetails(data: any) {
    return this.http.post(`${this.baseurl}/tag`, data, { headers: this.headers })
  }
  getTagDetails(params, orgId) {
    return this.http.get(`${this.baseurl}/tag?page_number=1&data_per_page=10&pagination=${params.pagination}&organization_id=${orgId}`, { headers: this.headers })
  }
  getTagDetailsPage(params) {
    return this.http.get(`${this.baseurl}/tag?search_key=${params.search_key}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&pagination=${params.pagination}&organization_id=${params.organization_id}`, { headers: this.headers })
  }
  deleteTagDetails(id: any) {
    return this.http.delete(`${this.baseurl}/tag/${id}`, { headers: this.headers })
  }
  getCurrentTagCategoryDetails(id: any, params) {
    return this.http.get(`${this.baseurl}/tag?id=${id}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&pagination=${params.pagination}&organization_id=${params.organization_id}`, { headers: this.headers })
  }
  updateTagCategory(id: any, data: any) {
    return this.http.put(`${this.baseurl}/tag/${id}`, data, { headers: this.headers })
  }

  // Profile
  updateProfileDetails(id, data: any) {
    return this.http.put(`${this.baseurl}/profile-custom-user/${id}`, data, { headers: this.headers })
  }
  // Profile

  // change password
  addChangePassword(data: any) {
    return this.http.post(`${this.baseurl}/change-password`, data, { headers: this.headers })
  }
  forgotPassword(data: any) {
    return this.http.post(`${this.baseurl}/password-reset`, data)
  }
  // change password

  //Cost center
  getCostCenterDetails(params) {
    return this.http.get(`${this.baseurl}/organization-cost-centers?page_number=1&data_per_page=2&pagination=${params.pagination}`, { headers: this.headers })
  }
  //Cost center

  //Subscription plan
  getSubscription() {
    return this.http.get(`${this.baseurl}/subscriptionplan`, { headers: this.headers })
  }
  //My Leaves
  getMyLeaves(id, params) {
    return this.http.get(`${this.baseurl}/users-leave-details?user_id=${id}&page_number=1&data_per_page=2&pagination=${params.pagination}`, { headers: this.headers })
  }
  getLeaveBalance(params, data) {
    return this.http.get(`${this.baseurl}/emp-balance-leave?user_id=${params.user_id}&days=${params.days}&leave_type_id=${params.leave_type_id}&from_date=${params.from_date}&to_data=${params.to_data}&from_session=${params.from_session}&to_session=${params.to_session}`, data)
  }
  getLeaveData(params, pagination) {
    return this.http.get(`${this.baseurl}/leave-application?approved_state=${params.approved_state}&user_id=${params.user_id}&leaveApplication_from_date=${params.leaveApplication_from_date}&leaveApplication_to_date=${params.leaveApplication_to_date}&page_number=${pagination.page_number}&data_per_page=${pagination.data_per_page}`, { headers: this.headers })
  }
  getLeavePaginationNone() {
    return this.http.get(`${this.baseurl}/leave-application?approved_state=APPROVED&page_number=1&data_per_page=2&pagination=FALSE`, { headers: this.headers })
  }
  getHolidayList(params) {
    return this.http.get(`${this.baseurl}/holidays?date=${params.date}&country=${params.country}&state=${params.state}`)
  }

  deletePeopleLeaves(id, params) {
    return this.http.delete(`${this.baseurl}/leave-application/${id}?module=${params.module}&menu=${params.menu}&method=${params.method}&user_id=${params.user_id}`, { headers: this.headers })
  }
  //Leave Application State Change
  leaveApplicationState(data: any) {
    return this.http.post(`${this.baseurl}/leave-application-state-change`, data, { headers: this.headers })
  }
  //addTimeSheet
  addTimeSheet(data: any) {
    return this.http.post(`${this.baseurl}/time-sheets`, data, { headers: this.headers })
  }
  // USER ROlES
  userAccessConfig(id, data) {
    return this.http.put(`${this.baseurl}/user-role/${id}`, data)
  }
  getUserAccess(params) {
    return this.http.get(`${this.baseurl}/user-role?${params}`)
  }
  addRoles(data, params) {
    return this.http.post(`${this.baseurl}/user-role`, data)
  }

  getUserRoleById(id) {
    return this.http.get(`${this.baseurl}/user-role?${id}`)
  }


  getData(params) {
    return this.http.get(params, { headers: this.headers })
  }

  // new profile url
  getProfileDetails(user_id:any){
    return this.http.get(`${this.baseurl}/user/${user_id}/`, { headers: this.headers })
  }
  updateUserProfileDetails(user_id:any,data:any){
    return this.http.put(`${this.baseurl}/user/${user_id}/`,data,{ headers: this.headers })
  }
  // profile ends here
  getDataWithHeaders(params) {
    return this.http.get(params, { headers: this.headers })
  }
  postData(url, data: any) {
    return this.http.post(url, data, { headers: this.headers })
  }
  updateData(url, data) {
    return this.http.put(url, data, { headers: this.headers })
  }
  delete(id) {
    return this.http.delete(id)
  }
}
