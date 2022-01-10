import * as yup from "yup";

export const formValidationRules = yup.object().shape({
    objectType: yup.string().required("Field required").min(5, "No less than 5"),
    sludge: yup.string().required("Field required"),
    triggers: yup.lazy(() => {
        return yup.array().of(yup.object({
            thresholdName: yup.string().required("Field required"),
            thresholdMinValue: yup.number().typeError("Must be a number").required("Field required")
                .test("min-valid", "Must be greater than 1 and than the previous maxValue", (value, context) => {
                    // @ts-ignore
                    const {index, from} = context.options
                    return index > 0 ? value!! > from[1].value.triggers[index - 1].thresholdMaxValue : value!! >= 1
                }),
            thresholdMaxValue: yup.number().typeError("Must be a number").required("Field required")
                .test("max-valid", "Must be greater than the previous minValue", (value, context) => {
                    // @ts-ignore
                    const {parent} = context.options
                    return value!! > parent.thresholdMinValue
                })
        }))
    })
})