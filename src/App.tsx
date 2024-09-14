import { zodResolver } from "@hookform/resolvers/zod";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import {
  Controller,
  FieldErrors,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { Container } from "./Container";
import { formDefaultValues, FormSchema, formSchema } from "./formSchema";

function App() {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormSchema>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const {
    fields: languagesFields,
    replace: replaceLanguages,
    append: appendLanguages,
    remove: removeLanguages,
  } = useFieldArray({
    control,
    name: "languages",
  });

  const fullErrors: FieldErrors<
    Extract<FormSchema, { hasWorkExperience: true }>
  > &
    FieldErrors<Extract<FormSchema, { educationLevel: "noFormalEducation" }>> &
    FieldErrors<Extract<FormSchema, { educationLevel: "highSchoolDiploma" }>> &
    FieldErrors<Extract<FormSchema, { educationLevel: "bachelorsDegree" }>> &
    FieldErrors<Extract<FormSchema, { knowsOtherLanguages: true }>> = errors;

  const hasWorkExperience = useWatch({ control, name: "hasWorkExperience" });
  const knowsOtherLanguages = useWatch({
    control,
    name: "knowsOtherLanguages",
  });
  const educationLevel = useWatch({ control, name: "educationLevel" });

  useEffect(() => {
    if (knowsOtherLanguages) {
      replaceLanguages([{ name: "" }]);
    }
  }, [knowsOtherLanguages, replaceLanguages]);

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <Container>
      <TextField
        {...register("fullName")}
        label="Full Name"
        helperText={fullErrors.fullName?.message}
        error={!!fullErrors.fullName}
      />
      <FormControlLabel
        {...register("hasWorkExperience")}
        label="Work Experience?"
        control={<Checkbox />}
      />
      {hasWorkExperience && (
        <TextField
          {...register("companyName")}
          label="Company Name"
          helperText={fullErrors.companyName?.message}
          error={!!fullErrors.companyName}
        />
      )}
      <FormControlLabel
        {...register("knowsOtherLanguages")}
        label="Know Other Languages?"
        control={<Checkbox />}
      />

      {knowsOtherLanguages && (
        <>
          {languagesFields.map((field, index) => (
            <div key={field.id}>
              <TextField
                sx={{ width: "100%" }}
                {...register(`languages.${index}.name`)}
                label="Language Name"
                helperText={fullErrors.languages?.[index]?.name?.message}
                error={!!fullErrors.languages?.[index]?.name?.message}
              />
              <IconButton
                disabled={languagesFields.length === 1}
                onClick={() => removeLanguages(index)}
                color="error"
              >
                <DeleteForeverRoundedIcon />
              </IconButton>
            </div>
          ))}
          <IconButton
            sx={{ width: "fit-content" }}
            onClick={() => appendLanguages({ name: "" })}
            color="success"
          >
            <AddCircleRoundedIcon />
          </IconButton>
        </>
      )}

      <FormControl>
        <FormLabel>Education Level</FormLabel>
        <Controller
          control={control}
          name="educationLevel"
          render={({ field }) => (
            <RadioGroup {...field}>
              <FormControlLabel
                value="noFormalEducation"
                control={<Radio />}
                label="No Formal Education"
              />
              <FormControlLabel
                value="highSchoolDiploma"
                control={<Radio />}
                label="High School Diploma"
              />
              <FormControlLabel
                value="bachelorsDegree"
                control={<Radio />}
                label="Bachelors Degree"
              />
            </RadioGroup>
          )}
        />
      </FormControl>

      {educationLevel === "highSchoolDiploma" && (
        <TextField
          {...register("schoolName")}
          label="High School Name"
          helperText={fullErrors.schoolName?.message}
          error={!!fullErrors.schoolName?.message}
        />
      )}
      {educationLevel === "bachelorsDegree" && (
        <TextField
          {...register("universityName")}
          label="University Name"
          helperText={fullErrors.universityName?.message}
          error={!!fullErrors.universityName?.message}
        />
      )}
      <Button variant="contained" onClick={handleSubmit(onSubmit)}>
        Submit
      </Button>
    </Container>
  );
}
export { App };
