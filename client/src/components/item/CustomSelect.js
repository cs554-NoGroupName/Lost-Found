import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function CustomSelect(props) {
  const { id, label, value, disabled, itemList, onChange } = props;
  // If item is lost, show color red, if Found show color green

  return (
    <FormControl
      sx={{
        display: "flex",
        flexDirection: "column",
        marginBottom: "20px",
      }}
    >
      <InputLabel
        id={`${id}-label`}
        sx={{
          color: "white",
          fontWeight: "bold",
          fontSize: "1.3rem",
        }}
      >
        {label}
      </InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        value={value?.toLowerCase()}
        label={label}
        disabled={disabled}
        onChange={onChange}
        sx={{
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}
      >
        {itemList.map((item) => (
          <MenuItem key={item} value={item.toLowerCase()}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CustomSelect;
