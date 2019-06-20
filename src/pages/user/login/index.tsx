import React, { useState } from 'react';
import { Input, Button, Form, Icon } from 'antd';

import styles from './index.less';

const { Item } = Form;

const UserLogin = ({ form }: any): React.ReactNode => {
  const { getFieldDecorator } = form;

  const userLogin = (e: any) => {
    e.preventDefault();

    form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  return (
    <Form className={styles.login} onSubmit={userLogin}>
      <Item>
        {getFieldDecorator('user', {
          rules: [{ required: true, message: '管理员账号不能为空！' }],
        })(
          <Input
            className={styles.input}
            placeholder='请输入管理员账户'
            prefix={<Icon type='user' className={styles.input} />} 
            size='large' />,
        )}
      </Item>

      <Item>
        {getFieldDecorator('pwd', {
          rules: [{ required: true, message: '管理员密码不能为空！' }],
        })(
          <Input
            className={styles.input}
            placeholder='请输入管理员密码'
            prefix={<Icon type='lock' className={styles.input} />} 
            size='large'
            type='password' />,
        )}
      </Item>

      <Item>
        <Button size='large' type='primary' block onClick={userLogin}>登录后台系统</Button>
      </Item>
    </Form>
  )
}

export default Form.create()(UserLogin);
