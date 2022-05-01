import {Control, Controller} from "react-hook-form";
import {FormFeedback, FormGroup, Input, Label} from "reactstrap";
import React, {ReactNode} from "react";

interface CustomSelectProps {
    control: Control<any, any>;
    name: string;
    label: string;
    options: ReactNode[]
    required?: boolean;
}

function CustomSelect({control, name, label, options, required}: CustomSelectProps) {
    return <Controller
        render={({field, fieldState: {error, invalid}}) => {
            return <FormGroup>
                <Label className="w-100 text-start">{label}{required && '*'}</Label>
                <Input
                    {...field}
                    type="select"
                    onChange={({target: {value}}) => field.onChange(value)}>
                    <option value="">Select an option</option>
                    {options.map(item => item)}
                </Input>
                <FormFeedback
                    className={`${invalid ? "d-block" : "d-none"} w-100 text-start`}
                    valid={!invalid}>
                    {error?.message}
                </FormFeedback>
            </FormGroup>
        }}
        name={name}
        control={control}/>
}

export default CustomSelect
