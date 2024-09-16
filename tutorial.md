show final project:
Creating dynamic forms where validation changes based on user actions is essential for handling complex forms. For example, if a user does not check the "Work Experience" box, the form's validation will differ compared to when it is checked. If the user selects the checkbox, additional validation is required, such as making the "Company Name" field mandatory for the form to be submitted. Similarly, for a "Known Languages" checkbox, if checked, the user should be able to add or remove languages, with each field having its own validation rules. This dynamic behavior can also apply to this radio group and any other dynamic form behavior that you desire.
Implementing such functionality can be a bit tricky, but it can be done in a clear and concise manner with minimal code. So let's implement it together.

# Tutorial Script

npm create vite@latest .
npm i
remove unnecessary also change app to named export and reimport it

but before we continue liking and subscribing can really help my career on youtube. I really appreciate it

install packages

```bash
npm i @emotion/react @emotion/styled @mui/icons-material @mui/material react-hook-form zod @hookform/resolvers
```

show package.json

```tsx main.tsx
<ThemeProvider
  theme={createTheme({
    palette: {
      mode: "dark",
    },
  })}
>
  <CssBaseline />

  <CssBaseline />
  <App />
</ThemeProvider>
```

for better organization and not making the main part of the tutorial complex, we create a container to put our app inside it

```tsx Container.tsx
import { Box, Paper, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
function Container({ children }: Props) {
  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper sx={{ width: 400, padding: 2 }}>
        <Stack sx={{ gap: 2 }}>
          <Typography variant="h6">Employment Form</Typography>
          {children}
        </Stack>
      </Paper>
    </Box>
  );
}

export { Container };
```

```tsx App.tsx
import { TextField } from "@mui/material";
import { Container } from "./Container";

function App() {
  return (
    <Container>
      <TextField label="Full Name" />
    </Container>
  );
}

export { App };
```

```typescript formSchema.ts
import { z } from "zod";

const formSchema = z.object({
  fullName: z.string().min(1),
});

type FormSchema = z.infer<typeof formSchema>;

const formDefaultValues: FormSchema = {
  fullName: "",
};

export { formDefaultValues, formSchema, type FormSchema };
```

```tsx App.tsx
import { TextField } from "@mui/material";
import { Container } from "./Container";
import { useForm } from "react-hook-form";
import { formDefaultValues, formSchema, FormSchema } from "./formSchema";
import { zodResolver } from "@hookform/resolvers/zod";

function App() {
  const {
    // [!code ++]
    register, // [!code ++]
    formState: { errors }, // [!code ++]
  } = useForm<FormSchema>({
    // [!code ++]
    mode: "all", // [!code ++]
    resolver: zodResolver(formSchema), // [!code ++]
    defaultValues: formDefaultValues, // [!code ++]
  }); // [!code ++]

  return (
    <Container>
      <TextField label="Full Name" /> {/* [!code --] */}
      <TextField // [!code ++]
        {...register("fullName")} // [!code ++]
        label="Full Name" // [!code ++]
        helperText={errors.fullName?.message} // [!code ++]
        error={!!errors.fullName} // [!code ++]
      /> {/* [!code ++] */}
    </Container>
  );
}

export { App };
```

show errors are working
CTA

now show full app and hasWorkExperience and its functionality
we need to improve our schema to add this dynamic validation behavior

```typescript formSchema.ts
import { z } from "zod";

const workExperienceSchema = z.discriminatedUnion("hasWorkExperience", [
  // [!code ++]
  z.object({
    // [!code ++]
    hasWorkExperience: z.literal(true), // [!code ++]
    companyName: z.string().min(1), // [!code ++]
  }), // [!code ++]
  z.object({ hasWorkExperience: z.literal(false) }), // [!code ++]
]); // [!code ++]

const formSchema = z
  .object({
    fullName: z.string().min(1),
  })
  .and(workExperienceSchema); // [!code ++]

type FormSchema = z.infer<typeof formSchema>;

const formDefaultValues: FormSchema = {
  fullName: "",
  hasWorkExperience: false, // [!code ++]
};

export { formDefaultValues, formSchema, type FormSchema };
```

now show typescript capabilities in defaultValues object and tag types

```tsx App.tsx
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { Container } from "./Container";
import { useForm } from "react-hook-form";
import { formDefaultValues, formSchema, FormSchema } from "./formSchema";
import { zodResolver } from "@hookform/resolvers/zod";

function App() {
  const {
    register,
    formState: { errors },
    control, // [!code ++]
    handleSubmit, // [!code ++]
  } = useForm<FormSchema>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const hasWorkExperience = useWatch({ control, name: "hasWorkExperience" }); // [!code ++]

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    // [!code ++]
    alert(JSON.stringify(data, null, 2)); // [!code ++]
  }; // [!code ++]

  return (
    <Container>
      <TextField
        {...register("fullName")}
        label="Full Name"
        helperText={errors.fullName?.message}
        error={!!errors.fullName}
      />
      <FormControlLabel // [!code ++]
        {...register("hasWorkExperience")} // [!code ++]
        label="Work Experience?" // [!code ++]
        control={<Checkbox />} // [!code ++]
      /> {/* [!code ++] */}
      {hasWorkExperience && ( // [!code ++]
        <TextField // [!code ++]
          {...register("companyName")} // [!code ++]
          label="Company Name" // [!code ++]
          helperText={errors.companyName?.message} // [!code ++]
          error={!!errors.companyName} // [!code ++]
        /> // [!code ++]
      )}{" "}
      {/* [!code ++] */}
      <Button variant="contained" onClick={handleSubmit(onSubmit)}>
        {" "}
        {/* [!code ++] */}
        Submit {/* [!code ++] */}
      </Button> {/* [!code ++] */}
    </Container>
  );
}

export { App };
```

now show the submit button that only works when form is validated

now the problem here is that the typescript is not smart enough to guess the errors from formState so we need to extend it a little for errors to be gone

```tsx App.tsx
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { Container } from "./Container";
import { useForm } from "react-hook-form";
import { formDefaultValues, formSchema, FormSchema } from "./formSchema";
import { zodResolver } from "@hookform/resolvers/zod";

function App() {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<FormSchema>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const fullErrors: FieldErrors<
    // [!code ++]
    Extract<FormSchema, { hasWorkExperience: true }> // [!code ++]
  > = errors; // [!code ++]

  const hasWorkExperience = useWatch({ control, name: "hasWorkExperience" });

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <Container>
      <TextField
        {...register("fullName")}
        label="Full Name"
        helperText={errors.fullName?.message} // [!code --]
        error={!!errors.fullName} // [!code --]
        helperText={fullErrors.fullName?.message} // [!code ++]
        error={!!fullErrors.fullName} // [!code ++]
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
          helperText={errors.companyName?.message} // [!code --]
          error={!!errors.companyName} // [!code --]
          helperText={fullErrors.companyName?.message} // [!code ++]
          error={!!fullErrors.companyName} // [!code ++]
        />
      )}{" "}
      <Button variant="contained" onClick={handleSubmit(onSubmit)}>
        {" "}
        Submit
      </Button>
    </Container>
  );
}

export { App };
```

now show knowsOtherLanguages checkbox from final app

```typescript formSchema.ts
import { z } from "zod";

const workExperienceSchema = z.discriminatedUnion("hasWorkExperience", [
  z.object({
    hasWorkExperience: z.literal(true),
    companyName: z.string().min(1),
  }),
  z.object({ hasWorkExperience: z.literal(false) }),
]);

const languageKnowledgeSchema = z.discriminatedUnion("knowsOtherLanguages", [
  // [!code ++]
  z.object({
    // [!code ++]
    knowsOtherLanguages: z.literal(true), // [!code ++]
    languages: z // [!code ++]
      .array(
        // [!code ++]
        z.object({
          // [!code ++]
          name: z.string().min(1), // [!code ++]
        }) // [!code ++]
      ) // [!code ++]
      .min(1), // [!code ++]
  }), // [!code ++]
  z.object({ knowsOtherLanguages: z.literal(false) }), // [!code ++]
]); // [!code ++]

const formSchema = z
  .object({
    fullName: z.string().min(1),
  })
  .and(workExperienceSchema)
  .and(languageKnowledgeSchema); // [!code ++]

type FormSchema = z.infer<typeof formSchema>;

const formDefaultValues: FormSchema = {
  fullName: "",
  hasWorkExperience: false,
  knowsOtherLanguages: false, // [!code ++]
};

export { formDefaultValues, formSchema, type FormSchema };
```

```tsx App.tsx
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { Container } from "./Container";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { formDefaultValues, formSchema, FormSchema } from "./formSchema";
import { zodResolver } from "@hookform/resolvers/zod";

function App() {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<FormSchema>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const fullErrors: FieldErrors<
    Extract<FormSchema, { hasWorkExperience: true }>
  > = errors;

  const hasWorkExperience = useWatch({ control, name: "hasWorkExperience" });

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
      <FormControlLabel // [!code ++]
        {...register("knowsOtherLanguages")} // [!code ++]
        label="Know Other Languages?" // [!code ++]
        control={<Checkbox />} // [!code ++]
      /> {/* [!code ++] */}
      <Button variant="contained" onClick={handleSubmit(onSubmit)}>
        Submit
      </Button>
    </Container>
  );
}

export { App };
```

now show from final app that when we click on the knowsOtherLanguages checkbox, we need to see array fields and add or remove languages

to do that:

```tsx App.tsx
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { Container } from "./Container";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { formDefaultValues, formSchema, FormSchema } from "./formSchema";
import { zodResolver } from "@hookform/resolvers/zod";

function App() {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<FormSchema>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const fullErrors: FieldErrors<
    Extract<FormSchema, { hasWorkExperience: true }>
  > = errors;

  const hasWorkExperience = useWatch({ control, name: "hasWorkExperience" });
  const knowsOtherLanguages = useWatch({
    // [!code ++]
    control, // [!code ++]
    name: "knowsOtherLanguages", // [!code ++]
  }); // [!code ++]

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
      {knowsOtherLanguages && <>array fields here</>} {/* [!code ++] */}
      <Button variant="contained" onClick={handleSubmit(onSubmit)}>
        Submit
      </Button>
    </Container>
  );
}

export { App };
```

so we need to use the amazing array fields from rhf:

```tsx App.tsx
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { Container } from "./Container";
import {
  FieldErrors,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { formDefaultValues, formSchema, FormSchema } from "./formSchema";
import { zodResolver } from "@hookform/resolvers/zod";

function App() {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<FormSchema>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const {
    // [!code ++]
    fields: languagesFields, // [!code ++]
    replace: replaceLanguages, // [!code ++]
    append: appendLanguages, // [!code ++]
    remove: removeLanguages, // [!code ++]
  } = useFieldArray({
    // [!code ++]
    control, // [!code ++]
    name: "languages", // [!code ++]
  }); // [!code ++]

  const fullErrors: FieldErrors<
    Extract<FormSchema, { hasWorkExperience: true }>
  > = errors;

  const hasWorkExperience = useWatch({ control, name: "hasWorkExperience" });
  const knowsOtherLanguages = useWatch({
    control,
    name: "knowsOtherLanguages",
  });

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
      {knowsOtherLanguages && <>array fields here</>}
      <Button variant="contained" onClick={handleSubmit(onSubmit)}>
        Submit
      </Button>
    </Container>
  );
}

export { App };
```

```tsx App.tsx
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
} from "@mui/material";
import { Container } from "./Container";

import { zodResolver } from "@hookform/resolvers/zod";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import {
  FieldErrors,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { formDefaultValues, formSchema, FormSchema } from "./formSchema";

function App() {
  const {
    register,
    formState: { errors },
    control,
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
  > = errors;

  const hasWorkExperience = useWatch({ control, name: "hasWorkExperience" });
  const knowsOtherLanguages = useWatch({
    control,
    name: "knowsOtherLanguages",
  });

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
          {languagesFields.map(
            (
              field,
              index // [!code ++]
            ) => (
              <div key={field.id}>
                <TextField // [!code ++]
                  sx={{ width: "100%" }} // [!code ++]
                  {...register(`languages.${index}.name`)} // [!code ++]
                  label="Language Name" // [!code ++]
                  helperText={fullErrors.languages?.[index]?.name?.message} // [!code ++]
                  error={!!fullErrors.languages?.[index]?.name?.message} // [!code ++]
                />{" "}
                // [!code ++]
                <IconButton // [!code ++]
                  disabled={languagesFields.length === 1} // [!code ++]
                  onClick={() => removeLanguages(index)} // [!code ++]
                  color="error" // [!code ++]
                >
                  {" "}
                  // [!code ++]
                  <DeleteForeverRoundedIcon /> // [!code ++]
                </IconButton> // [!code ++]
              </div> // [!code ++]
            )
          )}{" "}
          // [!code ++]
          <IconButton // [!code ++]
            sx={{ width: "fit-content" }} // [!code ++]
            onClick={() => appendLanguages({ name: "" })} // [!code ++]
            color="success" // [!code ++]
          >
            {" "}
            // [!code ++]
            <AddCircleRoundedIcon /> // [!code ++]
          </IconButton> // [!code ++]
        </> // [!code ++]
      )}{" "}
      // [!code ++]
      <Button variant="contained" onClick={handleSubmit(onSubmit)}>
        Submit
      </Button>
    </Container>
  );
}

export { App };
```

now we have errors on fullErrors on languages so we need to extended

```tsx App.tsx
const fullErrors: FieldErrors<
  Extract<FormSchema, { hasWorkExperience: true }>
> &
  FieldErrors<Extract<FormSchema, { knowsOtherLanguages: true }>> = // [!code ++]
  errors;
```

now if check the box we see nothing is showing because we did not add anything in here (hover over fields.map) to show. to do that

```tsx App.tsx
// above return
useEffect(() => {
  if (knowsOtherLanguages) {
    replaceLanguages([{ name: "" }]);
  }
}, [knowsOtherLanguages, replaceLanguages]);
```

show education level on final project

```typescript formSchema.tsx
const educationSchema = z.discriminatedUnion("educationLevel", [
  z.object({
    educationLevel: z.literal("noFormalEducation"),
  }),
  z.object({
    educationLevel: z.literal("highSchoolDiploma"),
    schoolName: z.string().min(1),
  }),
  z.object({
    educationLevel: z.literal("bachelorsDegree"),
    universityName: z.string().min(1),
  }),
]);

// on the formSchema
.and(educationSchema)
```

```tsx App.tsx
// above submit button
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
```

```tsx App.tsx
const educationLevel = useWatch({ control, name: "educationLevel" });
```

```tsx App.tsx
// above submit button
{
  educationLevel === "highSchoolDiploma" && (
    <TextField
      {...register("schoolName")}
      label="High School Name"
      helperText={fullErrors.schoolName?.message}
      error={!!fullErrors.schoolName?.message}
    />
  );
}
{
  educationLevel === "bachelorsDegree" && (
    <TextField
      {...register("universityName")}
      label="University Name"
      helperText={fullErrors.universityName?.message}
      error={!!fullErrors.universityName?.message}
    />
  );
}
```

```tsx App.tsx
FieldErrors<Extract<FormSchema, { educationLevel: "noFormalEducation" }>> &
  FieldErrors<Extract<FormSchema, { educationLevel: "highSchoolDiploma" }>> &
  FieldErrors<Extract<FormSchema, { educationLevel: "bachelorsDegree" }>>;
```
