import { Button } from "@mui/material";
import { z } from "zod";

const schema = z.object({
  fullName: z.string(),
  age: z.number(),
  employedBefore: z.boolean(),
  educationLevel: [],
  isMarried: z.boolean(), // have children,
});

function App() {
  return (
    <>
      <Button>foo</Button>
    </>
  );
}
export { App };
