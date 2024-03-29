import React from 'react';
import { Input, Button, Form, Icon, message } from 'antd';

import request from '@/utils/request';
import { setLocalStorage } from '@/utils';
import { setAuthority } from '@/utils/authority';

import styles from './index.less';

const { Item } = Form;

const UserLogin = ({ form, history }: any): React.ReactNode => {
  const { getFieldDecorator } = form;

  const userLogin = (e: any) => {
    e.preventDefault();

    form.validateFields((err: object, values: object) => {
      if (!err) {
        request('/user/login', {
          method: 'POST',
          data: values,
          requestType: 'form',
        })
        .then(res => {
          if (res && res.code === 200) {
            setLocalStorage('token', res.token);
            setAuthority(res.userType);
            message.success('恭喜，登陆成功！');
            setTimeout(() => history.push('/welcome'), 2000);
            return;
          }
        })
      }
    });
  };

  return (
    <Form className={styles.login} onSubmit={userLogin}>
      <Item>
        {getFieldDecorator('user', {
          rules: [{ required: true, message: '管理员账号不能为空！' }],
        })(
          <Input
            className={styles.input}
            placeholder="请输入管理员账户"
            prefix={<Icon type="user" className={styles.input} />}
            size="large"
          />
        )}
      </Item>

      <Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: '管理员密码不能为空！' }],
        })(
          <Input
            className={styles.input}
            placeholder="请输入管理员密码"
            prefix={<Icon type="lock" className={styles.input} />}
            size="large"
            type="password"
          />
        )}
      </Item>

      {/* <Item>
        {getFieldDecorator('admin')(
          <>
            <Switch />
            <span>管理员登录</span>
          </>
        )}
      </Item> */}

      <Item>
        <Button size="large" type="primary" block onClick={userLogin}>
          登录后台系统
        </Button>
      </Item>
    </Form>
  );
};

export default Form.create()(UserLogin);
