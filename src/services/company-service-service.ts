import { CompanyModel } from "./company-service";

export type CompanyServiceModel = {
  id: string;
  companyId: string;
  label: string;
  description: string | null;
  price: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  company: CompanyModel;
};

const CompanyServiceService = {};

export default CompanyServiceService;
