# Frontend Integration Guide

This guide shows how to connect your Next.js frontend to the backend API.

## 🔗 Backend Connection

### Option 1: Environment Variable (Recommended)

Create/update `next.config.ts` or add to your frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Option 2: Create API Client Utility

Create `lib/apiClient.ts` in your frontend:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getAuthToken() {
  const { auth } = await import('@/src/firebase');
  if (!auth.currentUser) {
    throw new Error('User not authenticated');
  }
  return await auth.currentUser.getIdToken();
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// Medication API functions
export const medicationAPI = {
  getAll: () => apiRequest<{ success: boolean; data: any[] }>('/api/medications'),
  
  getOne: (id: string) => 
    apiRequest<{ success: boolean; data: any }>(`/api/medications/${id}`),
  
  create: (medication: any) =>
    apiRequest<{ success: boolean; data: any }>('/api/medications', {
      method: 'POST',
      body: JSON.stringify(medication),
    }),
  
  update: (id: string, updates: any) =>
    apiRequest<{ success: boolean; data: any }>(`/api/medications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/api/medications/${id}`, {
      method: 'DELETE',
    }),
};

// Auth API functions
export const authAPI = {
  verify: () => 
    apiRequest<{ success: boolean; data: any }>('/api/auth/verify'),
  
  getProfile: () =>
    apiRequest<{ success: boolean; data: any }>('/api/auth/profile'),
};
```

## 📝 Usage Example

### In a React Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { medicationAPI } from '@/lib/apiClient';

export default function MedicationsList() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMedications() {
      try {
        const response = await medicationAPI.getAll();
        setMedications(response.data);
      } catch (error) {
        console.error('Failed to load medications:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMedications();
  }, []);

  const handleAdd = async () => {
    try {
      const newMed = await medicationAPI.create({
        name: 'Aspirin',
        dosage: '100mg',
        frequency: '1/day',
        start: new Date().toLocaleDateString(),
        addedBy: 'User'
      });
      // Refresh list
      const response = await medicationAPI.getAll();
      setMedications(response.data);
    } catch (error) {
      console.error('Failed to add medication:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleAdd}>Add Medication</button>
      <ul>
        {medications.map((med) => (
          <li key={med.id}>{med.name} - {med.dosage}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 🔄 Migration from Direct Firestore to Backend API

If you want to gradually migrate from direct Firestore calls to backend API:

### Before (Direct Firestore):
```typescript
import { db } from '@/src/firebase';
import { collection, addDoc } from 'firebase/firestore';

await addDoc(collection(db, 'medications'), {
  name: 'Aspirin',
  userId: user.uid,
  // ...
});
```

### After (Backend API):
```typescript
import { medicationAPI } from '@/lib/apiClient';

await medicationAPI.create({
  name: 'Aspirin',
  // userId is automatically added by backend
  // ...
});
```

## ⚡ Benefits of Using Backend API

1. **Centralized Logic**: Business logic lives in one place
2. **Better Security**: Admin SDK has controlled access
3. **Validation**: Server-side validation before database writes
4. **Audit Logs**: Easier to track all API requests
5. **Rate Limiting**: Can add rate limiting easily
6. **Data Transformation**: Process data before saving
7. **Third-party Integrations**: Easy to add external APIs

## 🚨 CORS Configuration

Ensure your backend `.env` has the correct `CORS_ORIGIN`:

```env
# For development
CORS_ORIGIN=http://localhost:3000

# For production
CORS_ORIGIN=https://your-frontend-domain.com
```

## 📊 Error Handling

```typescript
try {
  const response = await medicationAPI.create(medication);
  // Success
} catch (error) {
  if (error.message.includes('Unauthorized')) {
    // Redirect to login
  } else if (error.message.includes('Validation')) {
    // Show validation error
  } else {
    // Show generic error
  }
}
```

## ✅ Testing

Test the backend connection:

```typescript
// Test in browser console (after login)
const token = await firebase.auth().currentUser.getIdToken();
fetch('http://localhost:5000/api/medications', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(console.log);
```

