import React, {useState} from 'react';
import {Button, Card, Col, Container, Form, FormGroup, Row} from "reactstrap";
import {useFieldArray, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {formValidationRules} from "./tools/validations/formex-validation";
import FormControls from "./tools/interfaces/formex-inputs";
import CustomInput from "./ui/CustomInput";
import CustomSelect from "./ui/CustomSelect";
import expertises from "./tools/constants/expertises";

function App() {
    const [payload, setPayload] = useState<FormControls>()
    const methods = useForm<FormControls>({
        defaultValues: {
            name: "",
            expertise: "",
            experiences: []
        },
        resolver: yupResolver(formValidationRules),
        mode: "onChange"
    })
    const {control, formState: {isValid}, handleSubmit, trigger, reset} = methods
    const {append, remove, fields} = useFieldArray({control, name: "experiences", keyName: "_id"})
    const save = (data: FormControls) => {
        setPayload(data)
    }
    return (
        <div className="App">
            <Container>
                <Row className="justify-content-center">
                    <Col lg={9}>
                        <Card body className="border-primary mt-4 shadow">
                            <Form onSubmit={handleSubmit(save)}>
                                <CustomInput
                                    control={control}
                                    name="name"
                                    label="Name"
                                    required/>
                                <CustomSelect
                                    control={control}
                                    name="expertise"
                                    label="Mastered field"
                                    required
                                    options={expertises.map(item => <option value={item.value}>{item.label}</option>)}/>
                                {fields.map(
                                    (field, index) => <FormGroup key={field._id}>
                                        <Row xs={1} lg={5} className="g-1">
                                            <Col>
                                                <CustomInput
                                                    control={control}
                                                    name={`experiences.${index}.title`}
                                                    label="Job title"
                                                    required/>
                                            </Col>
                                            <Col>
                                                <CustomInput
                                                    control={control}
                                                    name={`experiences.${index}.company`}
                                                    label="Company (optional)"/>
                                            </Col>
                                            <Col>
                                                <CustomInput
                                                    control={control}
                                                    name={`experiences.${index}.from`}
                                                    label="Start date"
                                                    required/>
                                            </Col>
                                            <Col>
                                                <CustomInput
                                                    control={control}
                                                    name={`experiences.${index}.to`}
                                                    label="End date"/>
                                            </Col>
                                            <Col lg={1} className="d-flex flex-column justify-content-center">
                                                <Button
                                                    close
                                                    color="white"
                                                    title="Remove this experience"
                                                    onClick={() => {
                                                        remove(index)
                                                    }}/>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                )}
                                <FormGroup className="d-flex justify-content-start" onClick={() => {
                                    append({
                                        title: "",
                                        company: "-",
                                        from: new Date().toLocaleDateString(),
                                        to: new Date().toLocaleDateString()
                                    })
                                    trigger("experiences").finally()
                                }}>
                                    <Button color="white" disabled={fields.length >= 5} size="sm">
                                        <i className="bi bi-plus-circle-fill me-2"/>Add experience
                                    </Button>
                                </FormGroup>
                                <FormGroup className="d-flex justify-content-end">
                                    <Button color="white" size="sm" onClick={() => reset()}><i
                                        className="bi bi-x-circle-fill me-2"/>Clear
                                    </Button>
                                    <Button color="white" type="submit" className="ms-2" size="sm" disabled={!isValid}>
                                        <i className="bi bi-check-circle-fill me-2"/>Show data
                                    </Button>
                                </FormGroup>
                            </Form>
                        </Card>
                        {payload &&
                            <Card body className="border-success text-start my-4 shadow">
                                <p>Name: {payload?.name}</p>
                                <p>Expertise: {payload?.expertise}</p>
                                {payload?.experiences.map((item, index) => <div key={index}>
                                    <p>Job title: {item.title} | Company: {item.company} | Started
                                        at: {new Date(item.from).toLocaleDateString()} |
                                        Ended at: {new Date(item.to).toLocaleDateString()}</p>
                                </div>)}
                            </Card>}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default App;
