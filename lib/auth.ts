export interface User {
  id: string;
  email: string;
  name: string;
  role: 'donor' | 'recipient' | 'admin';
  profile?: DonorProfile | RecipientProfile;
  createdAt: string;
  verified: boolean;
}

export interface DonorProfile {
  fullName: string;
  age: number;
  gender: 'male' | 'female';
  bloodType: BloodType;
  phoneNumber: string;
  city: string;
  lastDonationDate?: string;
  isAvailable: boolean;
  profileVisibility: 'public' | 'private';
}

export interface RecipientProfile {
  name: string;
  hospitalName: string;
  phoneNumber: string;
  city: string;
  organizationType: 'hospital' | 'clinic' | 'individual';
}

export interface BloodRequest {
  id: string;
  recipientId: string;
  bloodType: BloodType;
  unitsNeeded: number;
  city: string;
  hospital: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
  status: 'active' | 'fulfilled' | 'expired';
  createdAt: string;
  expiresAt: string;
  interestedDonors: Array<{
    donorId: string;
    respondedAt: string;
    status: 'interested' | 'confirmed' | 'declined';
  }>;
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

// Simple JWT-like auth simulation
export class AuthService {
  private static currentUser: User | null = null;
  private static users: User[] = [];
  private static requests: BloodRequest[] = [];

  // Initialize demo data
  private static initializeDemoData(): void {
    // Demo users
    const demoUsers: User[] = [
      // Donors
      {
        id: 'donor1',
        email: 'ahmed.donor@example.com',
        name: 'Ahmed Hassan',
        role: 'donor',
        createdAt: '2024-01-15T10:00:00Z',
        verified: true,
        profile: {
          fullName: 'Ahmed Hassan',
          age: 28,
          gender: 'male',
          bloodType: 'O+',
          phoneNumber: '+1234567890',
          city: 'Cairo',
          lastDonationDate: '2024-01-01',
          isAvailable: true,
          profileVisibility: 'public',
        } as DonorProfile
      },
      {
        id: 'donor2',
        email: 'sara.donor@example.com',
        name: 'Sara Mohamed',
        role: 'donor',
        createdAt: '2024-01-20T14:30:00Z',
        verified: true,
        profile: {
          fullName: 'Sara Mohamed',
          age: 25,
          gender: 'female',
          bloodType: 'A+',
          phoneNumber: '+1234567891',
          city: 'Alexandria',
          lastDonationDate: '2023-12-15',
          isAvailable: true,
          profileVisibility: 'public',
        } as DonorProfile
      },
      {
        id: 'donor3',
        email: 'omar.donor@example.com',
        name: 'Omar Ali',
        role: 'donor',
        createdAt: '2024-02-01T09:15:00Z',
        verified: true,
        profile: {
          fullName: 'Omar Ali',
          age: 32,
          gender: 'male',
          bloodType: 'B-',
          phoneNumber: '+1234567892',
          city: 'Cairo',
          lastDonationDate: '2024-01-20',
          isAvailable: true,
          profileVisibility: 'public',
        } as DonorProfile
      },
      {
        id: 'donor4',
        email: 'fatima.donor@example.com',
        name: 'Fatima Al-Zahra',
        role: 'donor',
        createdAt: '2024-02-05T16:45:00Z',
        verified: true,
        profile: {
          fullName: 'Fatima Al-Zahra',
          age: 29,
          gender: 'female',
          bloodType: 'AB+',
          phoneNumber: '+1234567893',
          city: 'Giza',
          lastDonationDate: '2023-11-30',
          isAvailable: true,
          profileVisibility: 'public',
        } as DonorProfile
      },
      // Recipients
      {
        id: 'recipient1',
        email: 'hospital.cairo@example.com',
        name: 'Dr. Mahmoud Ibrahim',
        role: 'recipient',
        createdAt: '2024-01-10T08:00:00Z',
        verified: true,
        profile: {
          name: 'Dr. Mahmoud Ibrahim',
          hospitalName: 'Cairo University Hospital',
          phoneNumber: '+1234567894',
          city: 'Cairo',
          organizationType: 'hospital',
        } as RecipientProfile
      },
      {
        id: 'recipient2',
        email: 'clinic.alex@example.com',
        name: 'Dr. Nadia Farouk',
        role: 'recipient',
        createdAt: '2024-01-25T11:20:00Z',
        verified: true,
        profile: {
          name: 'Dr. Nadia Farouk',
          hospitalName: 'Alexandria Medical Center',
          phoneNumber: '+1234567895',
          city: 'Alexandria',
          organizationType: 'clinic',
        } as RecipientProfile
      },
      {
        id: 'recipient3',
        email: 'emergency.giza@example.com',
        name: 'Dr. Youssef Mansour',
        role: 'recipient',
        createdAt: '2024-02-03T13:10:00Z',
        verified: true,
        profile: {
          name: 'Dr. Youssef Mansour',
          hospitalName: 'Giza Emergency Hospital',
          phoneNumber: '+1234567896',
          city: 'Giza',
          organizationType: 'hospital',
        } as RecipientProfile
      }
    ];

    // Demo blood requests
    const demoRequests: BloodRequest[] = [
      {
        id: 'req1',
        recipientId: 'recipient1',
        bloodType: 'O+',
        unitsNeeded: 3,
        city: 'Cairo',
        hospital: 'Cairo University Hospital',
        urgencyLevel: 'critical',
        notes: 'Emergency surgery patient needs immediate blood transfusion. Patient is stable but requires O+ blood within 24 hours.',
        status: 'active',
        createdAt: '2024-12-20T10:30:00Z',
        expiresAt: '2024-12-27T10:30:00Z',
        interestedDonors: [
          {
            donorId: 'donor1',
            respondedAt: '2024-12-20T11:15:00Z',
            status: 'interested'
          }
        ]
      },
      {
        id: 'req2',
        recipientId: 'recipient2',
        bloodType: 'A+',
        unitsNeeded: 2,
        city: 'Alexandria',
        hospital: 'Alexandria Medical Center',
        urgencyLevel: 'high',
        notes: 'Cancer patient undergoing chemotherapy treatment. Regular blood transfusions needed.',
        status: 'active',
        createdAt: '2024-12-19T14:20:00Z',
        expiresAt: '2024-12-26T14:20:00Z',
        interestedDonors: []
      },
      {
        id: 'req3',
        recipientId: 'recipient3',
        bloodType: 'B-',
        unitsNeeded: 1,
        city: 'Giza',
        hospital: 'Giza Emergency Hospital',
        urgencyLevel: 'medium',
        notes: 'Scheduled surgery next week. Rare blood type B- needed for backup during operation.',
        status: 'active',
        createdAt: '2024-12-18T09:45:00Z',
        expiresAt: '2024-12-25T09:45:00Z',
        interestedDonors: []
      },
      {
        id: 'req4',
        recipientId: 'recipient1',
        bloodType: 'AB+',
        unitsNeeded: 4,
        city: 'Cairo',
        hospital: 'Cairo University Hospital',
        urgencyLevel: 'low',
        notes: 'Blood bank restocking for AB+ type. Non-urgent but needed for future emergencies.',
        status: 'active',
        createdAt: '2024-12-17T16:00:00Z',
        expiresAt: '2024-12-24T16:00:00Z',
        interestedDonors: [
          {
            donorId: 'donor4',
            respondedAt: '2024-12-17T17:30:00Z',
            status: 'interested'
          }
        ]
      },
      {
        id: 'req5',
        recipientId: 'recipient2',
        bloodType: 'O-',
        unitsNeeded: 5,
        city: 'Alexandria',
        hospital: 'Alexandria Medical Center',
        urgencyLevel: 'critical',
        notes: 'Multiple trauma patients from car accident. Universal donor blood O- urgently needed.',
        status: 'active',
        createdAt: '2024-12-20T08:15:00Z',
        expiresAt: '2024-12-27T08:15:00Z',
        interestedDonors: []
      }
    ];

    // Only initialize if no data exists
    if (typeof window !== 'undefined') {
      const existingUsers = localStorage.getItem('users');
      const existingRequests = localStorage.getItem('bloodRequests');
      
      if (!existingUsers) {
        this.users = demoUsers;
        localStorage.setItem('users', JSON.stringify(demoUsers));
      }
      
      if (!existingRequests) {
        this.requests = demoRequests;
        localStorage.setItem('bloodRequests', JSON.stringify(demoRequests));
      }
    }
  }
  static getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  static async login(email: string, password: string): Promise<User | null> {
    // Simulate API call
    // For demo purposes, accept any password for demo accounts
    const user = this.users.find(u => u.email === email);
    if (user) {
      this.currentUser = user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      return user;
    }
    return null;
  }

  static async register(userData: Partial<User>): Promise<User> {
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      name: userData.name!,
      role: userData.role!,
      createdAt: new Date().toISOString(),
      verified: false,
    };
    
    this.users.push(newUser);
    this.currentUser = newUser;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('users', JSON.stringify(this.users));
    }
    
    return newUser;
  }

  static logout(): void {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  }

  static updateProfile(profile: DonorProfile | RecipientProfile): void {
    if (this.currentUser) {
      this.currentUser.profile = profile;
      const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
      if (userIndex !== -1) {
        this.users[userIndex] = this.currentUser;
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('users', JSON.stringify(this.users));
      }
    }
  }

  static createBloodRequest(request: Omit<BloodRequest, 'id' | 'createdAt' | 'interestedDonors'>): BloodRequest {
    const newRequest: BloodRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      interestedDonors: [],
    };
    
    this.requests.push(newRequest);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('bloodRequests', JSON.stringify(this.requests));
    }
    
    return newRequest;
  }

  static getBloodRequests(): BloodRequest[] {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bloodRequests');
      if (stored) {
        this.requests = JSON.parse(stored);
      }
    }
    return this.requests;
  }

  static respondToRequest(requestId: string, donorId: string): void {
    const request = this.requests.find(r => r.id === requestId);
    if (request) {
      const existingResponse = request.interestedDonors.find(d => d.donorId === donorId);
      if (!existingResponse) {
        request.interestedDonors.push({
          donorId,
          respondedAt: new Date().toISOString(),
          status: 'interested'
        });
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('bloodRequests', JSON.stringify(this.requests));
        }
      }
    }
  }

  static getMatchingRequests(donorProfile: DonorProfile): BloodRequest[] {
    return this.getBloodRequests()
      .filter(request => 
        request.status === 'active' && 
        request.city.toLowerCase() === donorProfile.city.toLowerCase() &&
        this.isBloodTypeCompatible(donorProfile.bloodType, request.bloodType)
      )
      .sort((a, b) => {
        const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.urgencyLevel] - urgencyOrder[a.urgencyLevel];
      });
  }

  private static isBloodTypeCompatible(donorType: BloodType, recipientType: BloodType): boolean {
    const compatibility: Record<BloodType, BloodType[]> = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'A+', 'AB-', 'AB+'],
      'A+': ['A+', 'AB+'],
      'B-': ['B-', 'B+', 'AB-', 'AB+'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB-', 'AB+'],
      'AB+': ['AB+'],
    };
    
    return compatibility[donorType]?.includes(recipientType) || false;
  }

  static initializeData(): void {
    // Initialize demo data first
    this.initializeDemoData();
    
    if (typeof window !== 'undefined') {
      const storedUsers = localStorage.getItem('users');
      const storedRequests = localStorage.getItem('bloodRequests');
      
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      }
      
      if (storedRequests) {
        this.requests = JSON.parse(storedRequests);
      }
    }
  }
}