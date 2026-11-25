import React from 'react';
import { CreatePermitForm } from '@/frontend/components/CreatePermitForm';

export const metadata = {
  title: 'Create Permit to Work | Opmaint CMMS',
  description: 'Submit an industrial safety permit for hazardous work authorization',
};

export default function NewPermitPage() {
  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
      <CreatePermitForm />
    </main>
  );
}
