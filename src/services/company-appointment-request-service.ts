import { fetchHelper } from "../lib/fetch-helper";
import { UserModel } from "./auth-service";
import { CompanyModel } from "./company-service";

export enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export type CompanyAppointmentRequestModel = {
  id: string;
  companyId: string;
  userId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  company: CompanyModel;
  user: UserModel;
};

export type createAppointmentDto = {
  companyId: string;
  userId: string;
  date: string;
  time: string;
  subject: string;
  content: string;
};

const CompanyAppointmentRequestService = {
  // Get all appointments with filters
  async getAll(
    filters: FilterQuery & {
      status?: AppointmentStatus;
      userId?: string;
      companyId?: string;
      dateFrom?: string;
      dateTo?: string;
    },
    token: string,
  ) {
    const queryParams = new URLSearchParams();

    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.limit) queryParams.append("limit", filters.limit.toString());
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.userId) queryParams.append("userId", filters.userId);
    if (filters.companyId) queryParams.append("companyId", filters.companyId);
    if (filters.dateFrom) queryParams.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) queryParams.append("dateTo", filters.dateTo);

    const response = await fetchHelper<
      PaginateResponse<CompanyAppointmentRequestModel>
    >(`/appointments?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.error) throw new Error(response.error);

    return response.data;
  },

  // Get appointment by ID
  async getById(id: string, token: string) {
    const response = await fetchHelper<{
      data: CompanyAppointmentRequestModel;
    }>(`/appointments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.error) throw new Error(response.error);

    return response.data?.data || null;
  },

  // Create a new appointment
  async create(data: createAppointmentDto, token: string) {
    const response = await fetchHelper<{
      data: CompanyAppointmentRequestModel;
    }>("/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.error) throw new Error(response.error);

    return response.data?.data || null;
  },

  // Update appointment
  async update(id: string, data: Partial<createAppointmentDto>, token: string) {
    const response = await fetchHelper<{
      data: CompanyAppointmentRequestModel;
    }>(`/appointments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.error) throw new Error(response.error);

    return response.data?.data || null;
  },

  // Delete appointment
  async delete(id: string, token: string) {
    const response = await fetchHelper<{ message: string }>(
      `/appointments/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.error) throw new Error(response.error);

    return response.data;
  },

  // Get appointment count
  async getCount(token: string) {
    const response = await fetchHelper<{ count: number }>(
      `/appointments/count`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.error) throw new Error(response.error);

    return response.data;
  },

  // Get upcoming appointments
  async getUpcoming(days: number, token: string) {
    const response = await fetchHelper<CompanyAppointmentRequestModel[]>(
      `/appointments/upcoming?days=${days}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.error) throw new Error(response.error);

    return response.data;
  },

  // Get appointment statistics
  async getStatistics(token: string) {
    const response = await fetchHelper<{
      data: {
        total: number;
        pending: number;
        confirmed: number;
        cancelled: number;
        completed: number;
        unread: number;
      };
    }>(`/appointments/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.error) throw new Error(response.error);

    return response.data?.data || null;
  },

  // Get company appointments
  async getByCompanyId(companyId: string, filters: FilterQuery, token: string) {
    const queryParams = new URLSearchParams();

    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.limit) queryParams.append("limit", filters.limit.toString());

    const response = await fetchHelper<
      PaginateResponse<CompanyAppointmentRequestModel>
    >(`/appointments/company/${companyId}?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.error) throw new Error(response.error);

    return response.data;
  },

  // Update appointment status
  async updateStatus(id: string, status: AppointmentStatus, token: string) {
    const response = await fetchHelper<{
      data: CompanyAppointmentRequestModel;
    }>(`/appointments/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (response.error) throw new Error(response.error);

    return response.data;
  },

  // Mark appointment as read
  async markAsRead(id: string, token: string) {
    const response = await fetchHelper<{
      data: CompanyAppointmentRequestModel;
    }>(`/appointments/${id}/mark-read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.error) throw new Error(response.error);

    return response.data;
  },
};

export default CompanyAppointmentRequestService;
