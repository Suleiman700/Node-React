import TextField from '@mui/material/TextField';
import {useController, UseControllerProps} from 'react-hook-form';

type RHFTextFieldProps = UseControllerProps & {
    label?: string;
    multiline?: boolean;
    rows?: number;
};

export default function RHFTextField({
                                         name,
                                         label,
                                         multiline,
                                         rows,
                                         ...other
                                     }: RHFTextFieldProps) {
    const {
        field,
        fieldState: {error},
    } = useController({name, ...other});

    return (
        <TextField
            {...field}
            label={label}
            multiline={multiline}
            rows={rows}
            error={!!error}
            helperText={error?.message}
            InputLabelProps={{
                shrink: !!field.value || undefined,
            }}
            value={field.value || other.value || ''} // Default to an empty string to avoid `undefined`
            fullWidth
        />
    );
}
