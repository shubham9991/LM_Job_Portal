import * as Yup from "yup";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const jobSchema = Yup.object().shape({
  title: Yup.string().required("Job title is required"),
  type: Yup.string().required("Job type is required"),
  application_end_date: Yup.date()
    .transform((value, originalValue) =>
      originalValue ? new Date(originalValue) : null
    )
    .typeError("Please enter a valid date")
    .required("Application end date is required")
    .min(today, "Date must be today or in the future"),
  salary_min: Yup.number()
    .required("Minimum salary is required")
    .min(0, "Salary must be at least 0"),
  salary_max: Yup.number()
    .required("Maximum salary is required")
    .moreThan(
      Yup.ref("salary_min"),
      "Max salary must be greater than min salary"
    ),
  subjects: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one subject")
    .required("Subjects are required"),
  description: Yup.string().required("Description is required"),
  requirements: Yup.string().required("Requirements are required"),
  responsibilities: Yup.string().required("Responsibilities are required"),
});
