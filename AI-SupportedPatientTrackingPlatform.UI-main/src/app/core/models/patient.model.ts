export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other',
    PreferNotToSay = 'PreferNotToSay'
  }
  
  export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    fullAddress?: string;
  }
  
  export interface ContactInformation {
    phoneNumber: string;
    email?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  }
  
  export interface PatientNote {
    id: string;
    patientId: string;
    content: string;
    doctorId: string;
    doctorName: string;
    created: Date;
    lastModified?: Date;
  }
  
  export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    dateOfBirth: Date;
    age?: number;
    gender: Gender;
    identificationNumber: string;
    address: Address;
    contactInformation: ContactInformation;
    medicalHistory?: string;
    notes?: PatientNote[];
    created: Date;
    lastModified?: Date;
  }
  
  export interface CreateUpdatePatientDto {
    firstName: string;
    lastName: string;
    dateOfBirth: string | Date;
    gender: Gender;
    identificationNumber: string;
    medicalHistory?: string;
    // Address
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    // Contact Information
    phoneNumber: string;
    email?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  }
  
  export interface CreateUpdateNoteDto {
    content: string;
  }