import * as yup from "yup";

export const formValidationRules = yup.object().shape({
    name: yup.string().required("Field required").min(5, "No less than 5"),
    expertise: yup.string().required("Field required"),
    experiences: yup.lazy(() => {
        return yup.array().of(yup.object({
            title: yup.string().required("Field required"),
            from: yup.date().typeError("Must be a valid date").required("Field required")
                .test("min-valid", "Must be later than previous end date", (value, context) => {
                    const {index, from} = context.options as { index: number, from: Record<string, any> }
                    return (value && (index > 0 ? value > new Date(from[1].value.experiences[index - 1].to) : true)) || false
                }),
            to: yup.date().typeError("Must be a valid date").required("Field required")
                .test("max-valid", "Must be greater than the previous minValue", (value, context) => {
                    const {parent} = context.options as { parent: Record<string, any> }
                    return (value && value > parent.from && value <= new Date()) || false
                })
        }))
    })
})
