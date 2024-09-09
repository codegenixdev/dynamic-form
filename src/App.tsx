import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const isEmployedBeforeSchema = z.discriminatedUnion("isEmployedBefore", [
  z.object({ isEmployedBefore: z.literal(true), company: z.string() }),
  z.object({ isEmployedBefore: z.literal(false) }),
]);

const educationLevelSchema = z.discriminatedUnion("educationLevelSchema", [
  z.object({
    educationLevelSchema: z.literal("noEducation"),
  }),
  z.object({
    educationLevelSchema: z.literal("highSchool"),
    highSchoolName: z.string(),
  }),
  z.object({
    educationLevelSchema: z.literal("ba"),
    universityName: z.string(),
  }),
]);

const knowAnyLanguagesSchema = z.discriminatedUnion("knowAnyLanguages", [
  z.object({
    knowAnyLanguages: z.literal(true),
    languages: z.array(
      z.object({
        name: z.string(),
      })
    ),
  }),
  z.object({ knowAnyLanguages: z.literal(false) }),
]);

const formSchema = z
  .object({
    fullName: z.string(),
    age: z.string(),
  })
  .and(isEmployedBeforeSchema)
  .and(educationLevelSchema)
  .and(knowAnyLanguagesSchema);

function App() {
  const { register, getValues, watch, control } = useForm<
    z.infer<typeof formSchema>
  >({
    mode: "all",
    resolver: zodResolver(formSchema),
  });

  const isEmployedBefore = useWatch({ control, name: "isEmployedBefore" });
  const knowAnyLanguages = useWatch({ control, name: "knowAnyLanguages" });
  const {
    fields: languagesFields,
    replace: replaceLanguages,
    append: appendLanguages,
    remove: removeLanguages,
  } = useFieldArray({
    control,
    name: "languages",
  });

  useEffect(() => {
    if (knowAnyLanguages) {
      replaceLanguages([{ name: "foo" }]);
    }
  }, [knowAnyLanguages, replaceLanguages]);

  useEffect(() => {
    const sub = watch((value) => {
      console.log(value);
    });
    return sub.unsubscribe;
  }, [watch]);

  return (
    <>
      <TextField {...register("fullName")} label="Full Name" />
      <TextField {...register("age")} label="Age" />
      <Checkbox {...register("isEmployedBefore")} />
      {isEmployedBefore && (
        <TextField {...register("company")} label="Company" />
      )}
      <Checkbox {...register("knowAnyLanguages")} />
      {knowAnyLanguages && (
        <>
          {languagesFields.map((field, index) => (
            <div>
              <TextField
                {...register(`languages.${index}.name`)}
                key={field.id}
              />
              <Button
                onClick={() => {
                  removeLanguages(index);
                }}
              >
                Delete
              </Button>
            </div>
          ))}
          <Button
            onClick={() => {
              appendLanguages({ name: "" });
            }}
          >
            Add
          </Button>
        </>
      )}

      <Button onClick={() => formSchema.parse(getValues())}>Parse</Button>
      {add labels to checkboxes then make better names and add radio button education level}
    </>
  );
}
export { App };
