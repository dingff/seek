import { useEffect, useState } from 'react'
import { Button, Col, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Switch, Table } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons'
import { useUpdateEffect } from 'ahooks'
import ContextMenu from '@/components/ContextMenu'
import styles from './index.less'
import store from '@/common/store'
import { STORED_COLUMNS_KEY, DEFAULT_COLUMNS } from '@/common/constants'
import { IColumn } from '@/types'

type IProps = {
  // eslint-disable-next-line no-unused-vars
  onColumnsChange: (data: any[]) => void;
}
export default function HeaderContextMenu({
  onColumnsChange,
}: IProps) {
  const { Option } = Select
  const [form] = Form.useForm()
  const [tableVisible, setTableVisible] = useState(false)
  const [dataSource, setDataSource] = useState<any[]>([])
  const [addVisible, setAddVisible] = useState(false)
  const [editIndex, setEditIndex] = useState(-1)
  const columns = [
    { title: 'Title', dataIndex: 'title' },
    { title: 'Method', dataIndex: 'method' },
    { title: 'Field', dataIndex: 'field' },
    { title: 'Visible', render: renderVisible },
    { title: 'Action', render: renderAction },
  ]
  const contextMenuItems = [
    { label: 'Edit Columns' },
    { label: 'Reset Columns' },
  ]
  const handleContextMenuClick = (key: string) => {
    const handles = {
      'Edit Columns': () => {
        setTableVisible(true)
      },
      'Reset Columns': () => {
        Modal.confirm({
          title: 'Are you sure?',
          icon: <ExclamationCircleFilled />,
          content: 'This will reset the columns to its default and cannot be restored.',
          onOk() {
            setDataSource(DEFAULT_COLUMNS)
          },
          onCancel() {},
        })
      },
    }
    handles[key as keyof typeof handles]()
  }
  const handleSwitchChange = (title: string, checked: boolean) => {
    const next = dataSource.map((item: IColumn) => {
      return {
        ...item,
        visible: item.title === title ? checked : item.visible,
      }
    })
    setDataSource(next)
  }
  function renderVisible(v: string, r: any, i: number) {
    if (i === 0) return
    return (
      <Switch defaultChecked={r.visible !== false} onChange={(checked) => handleSwitchChange(r.title, checked)}></Switch>
    )
  }
  const handleEdit = (r: any, i: number) => {
    setAddVisible(true)
    setEditIndex(i)
    form.setFieldsValue({
      ...r,
    })
  }
  const handleDelete = (i: number) => {
    dataSource.splice(i, 1)
    setDataSource([...dataSource])
  }
  function renderAction(v: string, r: any, i: number) {
    return r.isCustom && (
      <div className={styles.action}>
        <EditOutlined onClick={() => handleEdit(r, i)} />
        <Popconfirm
          title="Delete"
          description="Are you sure to delete it?"
          onConfirm={() => handleDelete(i)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined />
        </Popconfirm>
      </div>
    )
  }
  const handleAdd = () => {
    setAddVisible(true)
    setEditIndex(-1)
  }
  const handleSubmit = () => {
    form.validateFields().then(() => {
      const formVal = form.getFieldsValue(true)
      if (editIndex !== -1) {
        dataSource[editIndex] = { ...dataSource[editIndex], ...formVal }
        setDataSource([...dataSource])
      } else {
        setDataSource([...dataSource, { ...formVal, isCustom: true }])
      }
      setAddVisible(false)
    })
  }
  useUpdateEffect(() => {
    onColumnsChange(dataSource)
    store.set(STORED_COLUMNS_KEY, dataSource)
  }, [dataSource])
  useEffect(() => {
    store.get(STORED_COLUMNS_KEY).then((list: any) => {
      if (list) {
        setDataSource(list)
      } else {
        setDataSource(DEFAULT_COLUMNS)
      }
    })
  }, [])
  return (
    <div className={styles.container}>
      <Modal footer={null} title="Columns" open={tableVisible} onCancel={() => setTableVisible(false)}>
        <Row justify="end" style={{ margin: '10px 0' }}>
          <Col><Button type="primary" onClick={handleAdd}><PlusOutlined /></Button></Col>
        </Row>
        <Table
          showSorterTooltip={false}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </Modal>
      <Modal
        width={300}
        title={editIndex !== -1 ? 'Edit' : 'Add'}
        open={addVisible}
        onOk={handleSubmit}
        destroyOnClose
        onCancel={() => {
          setAddVisible(false)
        }}
      >
        <Form
          preserve={false}
          form={form}
          style={{ marginTop: 20 }}
          layout="vertical"
          initialValues={{
            width: 60,
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input title!' }]}
          >
            <Input placeholder="Input title" />
          </Form.Item>
          <Form.Item
            label="Method"
            name="method"
            rules={[{ required: true, message: 'Please select method!' }]}
          >
            <Select placeholder="Select method">
              <Option value="get">get</Option>
              <Option value="post">post</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Field"
            name="field"
            rules={[{ required: true, message: 'Please input field!' }]}
          >
            <Input placeholder="Input field" />
          </Form.Item>
          <Form.Item
            label="Width"
            name="width"
            rules={[{ required: true, message: 'Please input width!' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Input width" min={50} max={100} step={10} />
          </Form.Item>
        </Form>
      </Modal>
      <ContextMenu
        target={document.querySelector('.ant-table-header')}
        items={contextMenuItems}
        onClick={handleContextMenuClick}
      />
    </div>
  )
}
