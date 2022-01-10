import React, {useState} from 'react';
import './App.css';
import {Button, Card, Col, Container, Form, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

interface FormControls {
    objectType: string;
    sludge: string;
    triggers: {
        thresholdName: string;
        thresholdColor: string;
        thresholdMinValue: number;
        thresholdMaxValue: number;
        thresholdDays: string;
    }[]
}

const formValidationRules = yup.object().shape({
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

function App() {
    const [payload, setPayload] = useState<FormControls>()
    const methods = useForm<FormControls>({
        defaultValues: {
            objectType: "",
            sludge: "",
            triggers: []
        },
        resolver: yupResolver(formValidationRules)
    })
    const {control, formState: {errors}, handleSubmit, trigger} = methods
    const {append, remove, fields} = useFieldArray({control, name: "triggers", keyName: "_id"})
    const save = (data: FormControls) => {
        setPayload(data)
    }
    return (
        <div className="App">
            <Container>
                <Row className="justify-content-center">
                    <Col lg={9}>
                        <Card body className="border-primary mt-4">
                            <Form onSubmit={handleSubmit(save)}>
                                <FormGroup>
                                    <Label for="object-type" className="w-100 text-start">Object type*</Label>
                                    <Controller
                                        render={({field}) => <Input {...field} id="object-type"/>}
                                        name="objectType"
                                        control={control}/>
                                    <FormFeedback valid={!errors.objectType}
                                                  className={`${errors.objectType ? "d-block" : "d-none"} w-100 text-start`}>
                                        {errors.objectType?.message}</FormFeedback>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="operation-types" className="w-100 text-start">Operation types*</Label>
                                    <Controller
                                        render={({field}) => {
                                            return <Input type="select" {...field} id="operation-types"
                                                          onChange={
                                                              ({target: {value}}) => {
                                                                  field.onChange(value)
                                                              }
                                                          }>
                                                <option value="">Choose one option</option>
                                                <option value="option-1">Option 1</option>
                                                <option value="option-2">Option 2</option>
                                            </Input>
                                        }}
                                        name="sludge"
                                        control={control}/>
                                    <FormFeedback className={`${errors.sludge ? "d-block" : "d-none"} w-100 text-start`}
                                                  valid={!errors.sludge}>{errors.sludge?.message}</FormFeedback>
                                </FormGroup>
                                {fields.map(
                                    (field, index) => <FormGroup key={field._id}>
                                        <Row>
                                            <Col>
                                                <Controller
                                                    name={`triggers.${index}.thresholdName`}
                                                    control={control}
                                                    render={({field}) => {
                                                        return (
                                                            <>
                                                                <Label className="w-100 text-start">Threshold
                                                                    name</Label>
                                                                <Input {...field} />
                                                                <FormFeedback
                                                                    valid={!errors.triggers?.[index]?.thresholdName}
                                                                    className={`${errors.triggers?.[index]?.thresholdName ? "d-block" : "d-none"} w-100 text-start`}>
                                                                    {errors.triggers?.[index]?.thresholdName?.message}</FormFeedback>
                                                            </>
                                                        )
                                                    }}/>
                                            </Col>
                                            {/*<Col md={1}>
                                                <Controller
                                                    name={`triggers.${index}.thresholdColor`}
                                                    control={control}
                                                    render={({field}) => {
                                                        return (
                                                            <>
                                                                <Input type="color" {...field} />
                                                            </>
                                                        )
                                                    }}/>
                                            </Col>*/}
                                            <Col>
                                                <Controller
                                                    name={`triggers.${index}.thresholdMinValue`}
                                                    control={control}
                                                    render={({field}) => {
                                                        return (
                                                            <>
                                                                <Label className="w-100 text-start">Threshold Min
                                                                    Value</Label>
                                                                <Input {...field} />
                                                                <FormFeedback
                                                                    valid={!errors.triggers?.[index]?.thresholdMinValue}
                                                                    className={`${errors.triggers?.[index]?.thresholdMinValue ? "d-block" : "d-none"} w-100 text-start`}>
                                                                    {errors.triggers?.[index]?.thresholdMinValue?.message}</FormFeedback>
                                                            </>
                                                        )
                                                    }}/>
                                            </Col>
                                            <Col>
                                                <Controller
                                                    name={`triggers.${index}.thresholdMaxValue`}
                                                    control={control}
                                                    render={({field}) => {
                                                        return (
                                                            <>
                                                                <Label className="w-100 text-start">Threshold Max
                                                                    Value</Label>
                                                                <Input {...field} />
                                                                <FormFeedback
                                                                    valid={!errors.triggers?.[index]?.thresholdMaxValue}
                                                                    className={`${errors.triggers?.[index]?.thresholdMaxValue ? "d-block" : "d-none"} w-100 text-start`}>
                                                                    {errors.triggers?.[index]?.thresholdMaxValue?.message}</FormFeedback>
                                                            </>
                                                        )
                                                    }}/>
                                            </Col>
                                            {/*<Col lg={2}>
                                                <Controller
                                                    name={`triggers.${index}.thresholdDays`}
                                                    control={control}
                                                    render={({field}) => {
                                                        return (
                                                            <>
                                                                <Label className="w-100 text-start">Days</Label>
                                                                <Input {...field} />
                                                                <FormFeedback
                                                                    valid={!errors.triggers?.[index]?.thresholdDays}
                                                                    className={`${errors.triggers?.[index]?.thresholdDays ? "d-block" : "d-none"} w-100 text-start`}>
                                                                    {errors.triggers?.[index]?.thresholdDays?.message}</FormFeedback>
                                                            </>
                                                        )
                                                    }}/>
                                            </Col>*/}
                                            <Col md={1}>
                                                <i className="bi bi-trash text-danger" title="Remove this row"
                                                   onClick={() => {
                                                       remove(index)
                                                   }} style={{cursor: "pointer"}}/>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                )}
                                <FormGroup className="d-flex justify-content-start" onClick={() => {
                                    append({
                                        thresholdName: "",
                                        thresholdColor: "black",
                                        thresholdMinValue: undefined,
                                        thresholdMaxValue: undefined,
                                        thresholdDays: undefined
                                    })
                                    trigger("triggers").finally()
                                }}>
                                    <Button color="secondary" outline disabled={fields.length >= 5}>Add threshold <i
                                        className="bi bi-plus ms-2"/></Button>
                                </FormGroup>
                                <FormGroup className="d-flex justify-content-end">
                                    <Button color="light"><i className="bi bi-x"/>Cancel</Button>
                                    <Button color="primary" type="submit" className="ms-2"><i
                                        className="bi bi-check me-2"/>Save</Button>
                                </FormGroup>
                            </Form>
                        </Card>
                        {payload &&
                        <Card body className="border-success text-start">
                            <p>Object type: {payload?.objectType}</p>
                            <p>Sludge: {payload?.sludge}</p>
                            {payload?.triggers.map((item, index) => <div key={index}>
                                <p>Threshold name: {item.thresholdName} | Threshold min value: {item.thresholdMinValue} | Threshold max value: {item.thresholdMaxValue}</p>
                            </div>)}
                        </Card>}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default App;
