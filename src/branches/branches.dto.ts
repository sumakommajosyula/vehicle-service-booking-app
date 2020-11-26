/**
 * Data transfer object for branch related information
 */
export class BranchDto {
    name: string;
    slots: [];
    technicians: [
      { 
        name: string, 
        phone_number: string
      }
    ];
  }
