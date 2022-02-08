import Head from "next/head";
import { useState } from "react";
import { Alert, Button, Form, Input, Layout, Typography } from "antd";
import styles from "../styles/Home.module.css";

const { Content } = Layout;
const { Title } = Typography;

export default function Home() {
  const [status, setStatus] = useState<"initial" | "error" | "success">(
    "initial"
  );
  const [message, setMessage] = useState("");
  const [form] = Form.useForm();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const onFinish = async ({ projectID }) => {
    fetch("/api/add_project", {
      method: "POST",
      body: JSON.stringify({ projectID }),
      headers: headers,
    })
      .then(async (response) => {
        setStatus("success");
        setMessage((await response.json()).success);
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error || "Something went wrong!");
      });
  };

  const onFinishedFailed = () => {
    setStatus("error");
    const error = form.getFieldError("projectID").join(" ");
    setMessage(error);
  };

  return (
    <Layout>
      <Head>
        <title>CF Downloads Monitor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Content className={styles.content}>
        <div className={styles.shortner}>
          <Title level={5}>Enter Project ID here</Title>
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishedFailed}
          >
            <div className={styles.linkField}>
              <div className={styles.linkFieldInput}>
                <Form.Item
                  name="projectID"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: "Please enter a valid project ID",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
              <div className={styles.linkFieldButton}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                    size="large"
                  >
                    Monitor!
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
          {["error", "success"].includes(status) && (
            <Alert
              showIcon
              message={message}
              type={status as "error" | "success"}
            />
          )}
        </div>
      </Content>
    </Layout>
  );
}
