import { z } from "zod";

const isEmployedBeforeSchema = z.discriminatedUnion("isEmployedBefore", [
  z.object({ isEmployedBefore: z.literal(true), company: z.string().min(1) }),
  z.object({ isEmployedBefore: z.literal(false) }),
]);

const educationLevelSchema = z.discriminatedUnion("educationLevelSchema", [
  z.object({
    educationLevelSchema: z.literal("noEducation"),
  }),
  z.object({
    educationLevelSchema: z.literal("highSchool"),
    highSchoolName: z.string().min(1),
  }),
  z.object({
    educationLevelSchema: z.literal("ba"),
    universityName: z.string().min(1),
  }),
]);

const knowAnyLanguagesSchema = z.discriminatedUnion("knowAnyLanguages", [
  z.object({
    knowAnyLanguages: z.literal(true),
    languages: z.array(
      z.object({
        name: z.string().min(1),
      })
    ),
  }),
  z.object({ knowAnyLanguages: z.literal(false) }),
]);

const formSchema = z
  .object({
    fullName: z.string().min(1),
  })
  .and(isEmployedBeforeSchema)
  .and(educationLevelSchema)
  .and(knowAnyLanguagesSchema);

type FormSchema = z.infer<typeof formSchema>;

export { formSchema, type FormSchema };
