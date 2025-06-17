export interface CaseRequestFull {
  id: number;
  code: string;
  title: string;
  type_case: string;
  status_request: string;
  creation: string;
  description: string;
  lawyerName: string
  evidencias?: Document[];
  cotizacion?: Document;
}

export interface Document {
  name: number;
  code: string;
}