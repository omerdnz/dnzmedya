'use client';

import { useQuery } from '@tanstack/react-query';
import { StatusBadge } from '@/components/ui/badge';
import { CrudResourcePage } from '@/components/ui/crud-resource-page';
import { apiFetch } from '@/lib/api';

interface UserRow {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: { id: string; name: string; slug: string };
}

interface Role {
  id: string;
  name: string;
  slug: string;
}

function UsersPageInner({ roles }: { roles: Role[] }) {
  const roleOptions = roles.map((r) => ({ value: r.id, label: r.name }));

  return (
    <CrudResourcePage<UserRow>
      title="Kullanıcılar"
      description="Admin panel kullanıcıları ve rolleri"
      endpoint="/users"
      queryKey="users"
      createLabel="Yeni Kullanıcı"
      getDefaultValues={() => ({
        email: '', password: '', firstName: '', lastName: '',
        roleId: roles[0]?.id ?? '', isActive: true,
      })}
      mapRowToForm={(row) => ({
        email: row.email, firstName: row.firstName, lastName: row.lastName,
        roleId: row.role.id, isActive: row.isActive, password: '',
      })}
      mapFormToPayload={(values, isEdit) => {
        const payload: Record<string, unknown> = {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          roleId: values.roleId,
          isActive: values.isActive,
        };
        if (!isEdit || values.password) payload.password = values.password;
        return payload;
      }}
      columns={[
        { key: 'name', header: 'Ad', render: (r) => `${r.firstName} ${r.lastName}` },
        { key: 'email', header: 'E-posta' },
        { key: 'role', header: 'Rol', render: (r) => r.role.name },
        { key: 'isActive', header: 'Durum', render: (r) => <StatusBadge active={r.isActive} /> },
      ]}
      fields={[
        { name: 'firstName', label: 'Ad', type: 'text', required: true },
        { name: 'lastName', label: 'Soyad', type: 'text', required: true },
        { name: 'email', label: 'E-posta', type: 'email', required: true, colSpan: 2 },
        { name: 'password', label: 'Şifre', type: 'password', required: true, showOnEdit: true, placeholder: 'Düzenlemede boş bırakın' },
        { name: 'roleId', label: 'Rol', type: 'select', options: roleOptions, required: true },
        { name: 'isActive', label: 'Aktif', type: 'checkbox', placeholder: 'Kullanıcı aktif' },
      ]}
    />
  );
}

export default function UsersPage() {
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => apiFetch<Role[]>('/users/roles', { auth: true }),
  });

  if (!roles) return <div className="h-64 animate-pulse rounded-2xl bg-brand-dark" />;
  return <UsersPageInner roles={roles} />;
}
