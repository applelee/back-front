import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Drawer, Form, Input, Icon } from 'antd';

import request from '@/utils/request';
import { setLocalStorage, dataVerify } from '@/utils';
import { setAuthority } from '@/utils/authority';

import styles from './index.less';

const { Item } = Form;

const UserManagement = ({ history }: any): React.ReactNode => {
  const [data, setData] = useState([])
  const [isDraw, setIsDraw] = useState(false)

  useEffect(() => {
    request('/user/list', {
      method: 'GET',
    })
    .then(res => {
      if (!dataVerify(res)) {
        setAuthority('');
        Modal.error({
          title: res.name,
          content: res.message,
          onOk: () => {
            history.push('/user/login');
          },
        });
        return;
      }

      setData(res.data.map((v: object) => {
        return {
          ...v,
          role: v.roles && v.roles[0].role,
        }
      }));
    })
  }, [history]);

  const columns = [{
    title: 'User',
    dataIndex: 'user',
    key: 'user',
  }, {
    title: 'DB',
    dataIndex: 'db',
    key: 'db',
  }, {
    title: 'Level',
    dataIndex: 'role',
    key: 'role',
  }, {
    title: 'Operation',
    key: 'operation',
    render: (o: object) => {
      return (
        <>
          {
            o.role !== 'root' && 
            <a>删除</a>
            ||
            <span>（超级管理员）</span>
          }
        </>
      )
    }
  }]

  return (
    <>
      <div className={styles.header}>
        <Button type='primary' onClick={() => setIsDraw(true)}>添加管理员</Button>
      </div>
      
      <Table rowKey={'userKey'} columns={columns} dataSource={data} />

      <Drawer
        title='添加用户'
        placement='right'
        width={360}
        visible={isDraw}
        onClose={() => setIsDraw(false)}>
        
        <AddUserForm history={history} />
      </Drawer>
    </>
  )
}

const AddUser = ({ form, history }: any): React.ReactNode => {
  const { getFieldDecorator } = form;

  const userLogin = (e: any) => {
    e.preventDefault();

    form.validateFields((err: object, values: object) => {
      if (!err) {
        request('/user/add', {
          method: 'POST',
          data: values,
          requestType: 'form',
        })
        .then(res => {
          if (!dataVerify(res)) {
            setAuthority('');
            Modal.error({
              title: res.name,
              content: res.message,
              onOk: () => {
                history.push('/user/login');
              },
            });
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
            placeholder="请输入管理员密码"
            prefix={<Icon type="lock" className={styles.input} />}
            size="large"
            type="password"
          />
        )}
      </Item>

      <Item>
        <Button size="large" type="primary" block onClick={userLogin}>
          添加管理员
        </Button>
      </Item>
    </Form>
  );
};

const AddUserForm = Form.create()(AddUser);

export default UserManagement
