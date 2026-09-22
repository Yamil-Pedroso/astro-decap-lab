export type ContactDepartment = "technical" | "sales";

export type ContactRoute = {
  label: string;
  department: ContactDepartment;
};

export const contactRouting: Record<string, ContactRoute> = {
  product: {
    label: "Product question",
    department: "sales",
  },

  pc_repair: {
    label: "PC Repair",
    department: "technical",
  },

  it_support: {
    label: "IT Support",
    department: "technical",
  },

  web_development: {
    label: "Web Development",
    department: "technical",
  },

  consulting: {
    label: "Consulting",
    department: "sales",
  },

  shipping: {
    label: "Shipping",
    department: "sales",
  },

  warranty: {
    label: "Warranty",
    department: "sales",
  },

  returns: {
    label: "Returns",
    department: "sales",
  },

  other: {
    label: "Other",
    department: "sales",
  },
};

export const departmentEmailEnv: Record<ContactDepartment, string> = {
  technical: "CONTACT_EMAIL_TECHNICAL",
  sales: "CONTACT_EMAIL_SALES",
};
