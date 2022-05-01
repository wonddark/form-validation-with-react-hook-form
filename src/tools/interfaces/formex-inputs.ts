interface FormControls {
    name: string;
    expertise: string;
    experiences: {
        title: string;
        company: string;
        from: string;
        to: string;
    }[]
}

export default FormControls
