/**
 * Data transfer object for branch related information
 */
export class BranchDto {
    name: string;
    slots: [];
    technicians: [
      { id: string,
        name: string, 
        phone_number: string
      }
    ];
  }
