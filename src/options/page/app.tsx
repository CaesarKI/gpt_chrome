import React, { useEffect, useMemo, useState } from 'react'
import 'antd/dist/reset.css';
import { Button, Card, Form, Input, Radio, Tooltip, message } from 'antd';
import browser from 'webextension-polyfill'
import styles from './index.less'

const Item = Form.Item
export default function App() {

  const [form] = Form.useForm();

  useEffect(() => {
    browser.storage.sync.get('openai').then(({ openai: data }) => {
      form.setFieldsValue(data||{})
    })
  }, [])

  const initValue = useMemo(() => {
    return {
      temperature: '0.7',
      address: 'https://api.openai.com/v1/chat',
      model: 'gpt-3.5-turbo',
      key: ""
    }
  }, [])

  const handelSumbitForm = async (value) => {
    await browser.storage.sync.set({ 'openai': value });
    message.info('更改成功')
  }


  return (
    <div className={styles.container}>
      <Card title='Open AI'>
        <Form
          onFinish={handelSumbitForm}
          form={form}
          initialValues={initValue}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}>
          <Item name="key" label='OpenAI API Key' required>
            <Input.Password></Input.Password>
          </Item>
          <Item name="model" label='模型' required >
            <Input disabled></Input >
          </Item>
          <Item name="temperature" label='温度' required>
            <Radio.Group>
              <Tooltip title="0">
                <Radio.Button value="0">精准</Radio.Button>
              </Tooltip>
              <Tooltip title="0.7">
                <Radio.Button value="0.7">平衡</Radio.Button>
              </Tooltip>
              <Tooltip title="1">
                <Radio.Button value="1">创造力</Radio.Button>
              </Tooltip>
            </Radio.Group>
          </Item>
          <Item name="address" label='Open API' required>
            <Input></Input>
          </Item>
          <Item wrapperCol={{ span: 24 }} style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Item>
        </Form>
      </Card>
    </div>
  )
}


