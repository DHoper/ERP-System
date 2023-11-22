import { useState } from "react";
import {
  Container,
  Stack,
  Button,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import DynamicForm from "../../components/form/DynamicForm";
import SimpleCard from "../../components/SimpleCard";
import { DynamicFormType } from "../../types/ComponentsTypes";
import AvatarImage from "../../components/form/fieldElements/AvatarImage";

const UserEdit = () => {
  const [formData, setFormData] = useState({});

  const fields: DynamicFormType[] = [
    {
      name: "name",
      label: "姓名",
      fieldType: "text",
      fullWidth: false,
    },
    {
      name: "email",
      label: "信箱",
      fieldType: "text",
      fullWidth: false,
    },
    {
      name: "username",
      label: "暱稱",
      fieldType: "text",
      fullWidth: false,
    },
    {
      name: "password",
      label: "密碼",
      fieldType: "password",
      fullWidth: false,
    },
    {
      name: "phone",
      label: "電話",
      fieldType: "phone",
      fullWidth: false,
    },
    {
      name: "address",
      label: "地址",
      fieldType: "text",
      fullWidth: false,
    },
    {
      name: "gender",
      label: "性別",
      fieldType: "radioGroup",
      options: [
        { label: "男", value: "男" },
        { label: "女", value: "女" },
        { label: "其他", value: "其他" },
      ],
      fullWidth: false,
    },
  ];

  const handleFieldChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  return (
    <Container sx={{ width: "70%" }}>
      <SimpleCard>
        <Container
          sx={{
            /*  border: "solid 2px #616161", */
            borderRadius: ".3rem",
          }}
        >
          <FormControlLabel
            sx={{ marginLeft: "auto", display: "block", width: "fit-content" }}
            control={
              <Switch sx={{ m: 1, fontWeight: "bold" }} defaultChecked />
            }
            label=""
            labelPlacement="start"
          />
          <Stack direction={{ xs: "column", lg: "row" }} alignItems={"center"}>
            <AvatarImage />
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ marginX: 10 }}
            />
            <DynamicForm fields={fields} onFieldChange={handleFieldChange} />
          </Stack>
        </Container>
        <Stack
          direction="row"
          justifyContent="end"
          sx={{ mt: 4 }}
          spacing={2}
        >
          <Button variant="contained" size="large">
            確認
          </Button>
          <Button variant="outlined" size="large">
            取消
          </Button>
        </Stack>
      </SimpleCard>
    </Container>
  );
};

export default UserEdit;
