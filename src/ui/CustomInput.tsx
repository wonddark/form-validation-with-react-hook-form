import {FormFeedback, FormGroup, Input, Label} from "reactstrap";
import {Control, Controller} from "react-hook-form";
import React from "react";

interface CustomInputProps {
    control: Control<any, any>;
    name: string;
    label: string;
    required?: boolean;
}

function CustomInput({control, name, label, required}: CustomInputProps) {
    return <Controller
        render={({field, fieldState: {error, invalid}}) =>
            <FormGroup>
                <Label className="w-100 text-start">{label}{required && '*'}</Label>
                <Input {...field}/>
                <FormFeedback
                    valid={!invalid}
                    className={`${invalid ? "d-block" : "d-none"} w-100 text-start`}>
                    {error?.message}
                </FormFeedback>
            </FormGroup>
        }
        name={name}
        control={control}/>
}

export default CustomInput
