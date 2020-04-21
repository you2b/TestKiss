# TestKiss

## 1.环境依赖
> 1. python3, 请自行网上查找
> 2. mongo, mongo 安装请参考：https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/
> 3. 安装完成后记得启动 mongo, 假如你的mongodb 地址是：127.0.0.1

## 2.安装步骤
> 1. git clone https://github.com/you2b/TestKiss.git
> 2. cd TestKiss
> 3. pip3 install -r requirements.txt
> 4. 初始化mongodb, python3 init_mongo.py 127.0.0.1 #脚本后面跟mongodb 的地址
> 5. 然后修改 TestKiss/config.py 中，相关 SERVER_URL, MONGO_URI 等参数

## 3.测试配置运行
> 1. 执行 nohup python3 app.py >/dev/null 2>&1 &

## 4. 其他
> 1. 暂时没有精力去做权限管理和测试统计模块，有兴趣的童鞋可以拿去研究下；
> 2. 使用flask 框架写的，前端找的一套开源的页面，前端代码可能有些乱；
整体流程下来应该没什么问题；


## 使用说明
### 1.登录&注册
#### 1.1 登录
> 1.本系统为独立的用例管理系统，没有接入LDAP, 需要先注册账号
> 2.登录使用注册的用户名和密码登录
![登录](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E7%99%BB%E5%BD%95.jpeg)

#### 1.2 注册
> 1. 注册用户名和邮箱需要唯一
> 2. 密码需要符合长度规范
![注册](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E6%B3%A8%E5%86%8C.jpeg)

### 2.产品模块
#### 2.1 产品列表
> 1. 产品列表倒序展示，分页显示第一页；

#### 2.2 添加产品
> 1. 添加产品，产品名称唯一，必须选择【产品分类】
![添加产品](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E6%B7%BB%E5%8A%A0%E4%BA%A7%E5%93%81(%E9%A1%B9%E7%9B%AE).png)
#### 2.3 删除产品
> 1. 在列表中点击删除，会弹窗确认是否删除；

#### 2.4 添加产品分类
> 1. 添加产品分类，需要填写名称和分类
![添加产品分类](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E6%B7%BB%E5%8A%A0%E4%BA%A7%E5%93%81%E5%88%86%E7%B1%BB.png)

### 2.5 产品分类列表
> 1. 倒序展示产品分类，翻页展示第1页

#### 2.6 删除分类
> 1. 点击删除，弹窗确认是否删除；

### 3.测试用例
#### 3.1 测试用例列表
> 1. 点击测试用例列表前，需要先选择一个产品；
![选择测试项目](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E7%BC%96%E5%86%99%E7%94%A8%E4%BE%8B-%E9%80%89%E6%8B%A9%E9%A1%B9%E7%9B%AE.png)
> 2. 选择产品后，会跳转到相关产品测试用例列表；
> 3. 用例列表会根据，产品模块和用例的排序key, 进行排序；
![测试用例列表](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B%E5%88%97%E8%A1%A8.png)
> 4. 用例列表可以进行快速编辑
![测试用例列表2](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B%E5%88%97%E8%A1%A82.png)
> 5. 点击编辑，可对单个用例进行编辑
![编辑单个测试用例](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E6%9B%B4%E6%96%B0%E5%8D%95%E4%B8%AA%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B.png)
> 6. 拖拽可以对模块和用例进行排序

#### 3.2添加用例
> 0.先要选择一个产品
![编辑前需要先选择项目](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E7%BC%96%E5%86%99%E7%94%A8%E4%BE%8B-%E9%80%89%E6%8B%A9%E9%A1%B9%E7%9B%AE.png)
> 1.添加用例前，需要选中【叶子模块】#只有叶子节点可以添加用例
> 2. 如果没有产品模块可以先添加模块；#有parent/child/leaf 三种类型模块
> 3. 选中一个节点之后，可以添加保存用例；
![编辑测试用例1](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E7%BC%96%E5%86%99case%E6%AD%A5%E9%AA%A41.png)
> 4. 模块之间可以拖拽移动
> 5. 用例也可以拖拽进行排序
> 6. 模块和用例都可以拖拽进行删除；
> 7. 测试步骤和预期结果都支持，复制剪切的图功能；
![编写测试用例2](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E7%BC%96%E5%86%99case%E6%AD%A5%E9%AA%A42.png)


#### 3.3批量导入测试用例
> 1.在添加用例右上角可以看到，批量导入的按钮；
![批量导入1]（https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A51.png)
> 2.点击批量导入，点击下载用例模板；
![批量导入2](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A52.png)
> 3.批量导入分为三级模块
![批量导入3](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A53.png)
PS: 如果模块下有子模块，那么这个模块下的case, 都需要填写子模块（如果没有就合父模块同名）；

### 4. 测试计划
#### 4.1 测试计划列表
> 1. 进入测试计划列表前，需要先选择一个产品
![选择产品](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E6%B5%8B%E8%AF%95%E8%AE%A1%E5%88%92-%E9%80%89%E6%8B%A9%E4%BA%A7%E5%93%81.png)
> 2. 列表倒序显示，翻页显示第1页，每页20条记录
> 3. 点击添加，可以添加测试计划
> 4. 点击编辑，可以编辑测试计划
> 5. 点击删除可以删除测试计划，但是存在测试执行的情况下不能删除；
> 6. 点击【查看执行】 可以进入用例执行列表
![测试计划列表](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E6%B5%8B%E8%AF%95%E8%AE%A1%E5%88%92%E5%88%97%E8%A1%A8.png)

#### 4.2 添加测试计划
> 1. 添加测试计划，需要先选择一个产品版本；
> 2. 如果产品版本不存在可以先创建这个版本；
> 3. 测试计划没有关联用例，测试计划关联的是【测试执行】
![新增测试计划](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E6%96%B0%E5%A2%9E%E6%B5%8B%E8%AF%95%E8%AE%A1%E5%88%92.png)


### 5. 测试执行
#### 5.1 测试执行列表
> 1. 从测试计划点击【查看执行】 可以进入对应的测试执行列表；
> 2. 点击开始执行，进入【测试执行】 页面
> 3. 点击删除，可以删除对应执行；
![测试执行列表1](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E6%B5%8B%E8%AF%95%E6%89%A7%E8%A1%8C%E5%88%97%E8%A1%A8.png)
#### 5.2 测试执行页面
> 1. 测试执行页面，可以修改用例执行通过或失败；
> 2. 点击【结束执行】，更新结束执行，并返回到执行列表； 记录变成【查看报告】状态
> 3. 执行页面，可以通过点击模块名称过滤，测试用例
![测试执行列表2](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E6%B5%8B%E8%AF%95%E6%89%A7%E8%A1%8C%E5%88%97%E8%A1%A82.png)

#### 5.3 添加测试执行
> 1. 添加测试执行，需要选择对应的用例；
> 2. 需要填写执行的名称，和需要执行的人；
![创建测试执行](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E5%88%9B%E5%BB%BA%E6%B5%8B%E8%AF%95%E6%89%A7%E8%A1%8C.png)

### 6. 用户管理
#### 6.1 用户列表
> 1. 点击默认进入用户列表；
> 2. 默认展示翻页第1页的20个用户
> 3. 可以根据首字母进行过滤
![用户列表](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E7%94%A8%E6%88%B7%E5%88%97%E8%A1%A8.png)

#### 6.2 用户详情
> 1. 点击 view profile, 可以查看对应用户详情；
![用户详情](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E7%94%A8%E6%88%B7%E8%AF%A6%E6%83%85.png)
> 2. 用户只能编辑自己的信息；
![编辑个人信息](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E7%BC%96%E8%BE%91%E4%B8%AA%E4%BA%BA%E4%BF%A1%E6%81%AF.png)
> 3. 编辑头像
![编辑头像](https://github.com/you2b/TestKiss/blob/master/SamplePicture/%E7%BC%96%E8%BE%91%E7%94%A8%E6%88%B7%E5%A4%B4%E5%83%8F.png)

### 7. 其他
> 系统设置和权限管理暂时没有做
