import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { updateUser } from "../../api";
import { fetchRoles } from "../../../roles/api";
import type { User, UpdateUserPayload } from "../../types";

export interface FormState {
  name: string;
  email: string;
  password?: string;
  phone: string;
  is_active: boolean;
  role: string;
}

export const useEditUserForm = (user: User | null, onClose: () => void) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    phone: "",
    is_active: true,
    role: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  useEffect(() => {
    if (user) {
      const roleVal = user.roles && user.roles.length > 0 ? user.roles[0] : user.role ?? "";
      setForm({
        name: user.name,
        email: user.email,
        password: "",
        phone: user.phone,
        is_active: user.is_active,
        role: roleVal,
      });
      setErrors({});
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(user!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", user!.id] });
      onClose();
    },
  });

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    staleTime: 5 * 60 * 1000,
  });
  const allRoles = rolesData?.data ?? [];

  const validate = () => {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = "الاسم مطلوب";
    if (!form.email.trim()) errs.email = "البريد الإلكتروني مطلوب";
    if (!form.phone.trim()) errs.phone = "رقم الهاتف مطلوب";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;

    const payload: Partial<UpdateUserPayload> = {
      name: form.name,
      phone: form.phone,
      is_active: form.is_active,
      role: form.role,
      ...(form.password ? { password: form.password } : {}),
    };

    if (form.email !== user.email) {
      payload.email = form.email;
    }

    updateMutation.mutate(payload as UpdateUserPayload);
  };

  const setField = (field: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return {
    form,
    errors,
    setField,
    handleSubmit,
    isPending: updateMutation.isPending,
    apiError: updateMutation.error,
    allRoles,
    rolesLoading,
  };
};
