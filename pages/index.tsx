import Head from 'next/head'
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Alert, Button, Form, Input, Layout, Typography } from 'antd'
import styles from '../styles/Home.module.css'

const { Content } = Layout;
const { Title } = Typography;

type AddProjectResponse = {
  success: string;
}

type AddProjectError = {
  error: string;
  error_description: string;
}

type FormValues = {
  projectID : number;
}

export default function Home() {
  const [status, setStatus] = useState<'initial' | 'error' | 'success'>('initial');
  const [message, setMessage] = useState('');
  const [form] = Form.useForm();

  const onFinish = async ({ projectID }: FormValues) => {
    try {
      const response = await axios.post<AddProjectResponse>('/api/add_project', { projectID });
      setStatus('success');
      setMessage(response.data?.success);
    }
    catch(e) {
      const error = e as AxiosError<AddProjectError>;
      setStatus('error');
      setMessage(error.response?.data?.error_description || 'Something went wrong!');
    }
  }

  const onFinishedFailed = () => {
    setStatus('error');
    const error = form.getFieldError('projectID').join(' ');
    setMessage(error);
  }

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
                <Form.Item name="projectID" noStyle rules={[{
                  required: true,
                  message: 'Please enter a valid project ID'
                }]}>
                  <Input size="large"/>
                </Form.Item>
              </div>
              <div className={styles.linkFieldButton}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{ width: '100%' }} size="large">
                    Monitor!
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
          {['error', 'success'].includes(status) && (<Alert showIcon message={message} type={status as 'error' | 'success'} />)}
        </div>
      </Content>
    </Layout>
  )
}