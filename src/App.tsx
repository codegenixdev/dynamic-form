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
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Container } from "./Container";
import { FormSchema, formSchema } from "./formSchema";

function App() {
  const { register, getValues, watch, control } = useForm<FormSchema>({
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

  const educationLevel = useWatch({ control, name: "educationLevelSchema" });

  useEffect(() => {
    if (knowAnyLanguages) {
      replaceLanguages([{ name: "" }]);
    }
  }, [knowAnyLanguages, replaceLanguages]);

  useEffect(() => {
    const sub = watch((value) => {
      console.log(value);
    });
    return sub.unsubscribe;
  }, [watch]);
  now add form context and fields controllers

  return (
    <Container>
      <TextField {...register("fullName")} label="Full Name" />
      <FormControlLabel
        {...register("isEmployedBefore")}
        label="Employed before?"
        control={<Checkbox />}
      />
      {isEmployedBefore && (
        <TextField {...register("company")} label="Company" />
      )}
      <FormControlLabel
        {...register("knowAnyLanguages")}
        label="Know Any Languages?"
        control={<Checkbox />}
      />

      {knowAnyLanguages && (
        <>
          {languagesFields.map((field, index) => (
            <div>
              <TextField
                {...register(`languages.${index}.name`)}
                key={field.id}
              />
              <IconButton onClick={() => removeLanguages(index)} color="error">
                <DeleteForeverRoundedIcon />
              </IconButton>
            </div>
          ))}
          <IconButton
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
          name="educationLevelSchema"
          render={({ field }) => (
            <RadioGroup {...field}>
              <FormControlLabel
                value="noEducation"
                control={<Radio />}
                label="No Education"
              />
              <FormControlLabel
                value="highSchool"
                control={<Radio />}
                label="High School"
              />
              <FormControlLabel value="ba" control={<Radio />} label="BA" />
            </RadioGroup>
          )}
        />
      </FormControl>

      {educationLevel === "highSchool" && (
        <TextField {...register("highSchoolName")} label="High School Name" />
      )}
      {educationLevel === "ba" && (
        <TextField {...register("universityName")} label="University Name" />
      )}
      <Button variant="contained" onClick={() => formSchema.parse(getValues())}>
        Submit
      </Button>
    </Container>
  );
}
export { App };
