import { z } from "zod";
import { isStudentEmail, normalizeEmail } from "@/lib/utils";

export const sendCodeSchema = z.object({
  email: z
    .string()
    .trim()
    .email("请输入有效邮箱")
    .transform(normalizeEmail)
    .refine(isStudentEmail, "仅支持 @student.unimelb.edu.au 学生邮箱"),
});

export const verifyCodeSchema = z.object({
  email: z
    .string()
    .trim()
    .email("请输入有效邮箱")
    .transform(normalizeEmail)
    .refine(isStudentEmail, "仅支持 @student.unimelb.edu.au 学生邮箱"),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "请输入 6 位数字验证码"),
});

export const completeProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, "昵称至少 2 个字符")
    .max(20, "昵称不能超过 20 个字符")
    .regex(/^[一-龥A-Za-z0-9_]+$/, "昵称仅支持中文、英文、数字和下划线"),
});
