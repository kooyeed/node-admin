<% if(typeof(message) != "undefined") {%>
<div class="alert alert-error">
  <a class="close" data-dismiss="alert">×</a>
  <h4 class="alert-heading"><%- message.type%></h4>
  <%- message.message%>
</div>
<%}%>
<ul class="breadcrumb">
    <li>
        <a href="<%- url_base%>/admin/home">首页</a> <span class="divider">/</span>
    </li>  
    <li>
        <a href="<%- url_base%>/admin/list">新闻管理</a> <span class="divider">/</span>
    </li>    
    <li class="active">新增新闻</li>     
</ul>

<form action="<%- url_base%>/news/<%- action%>" method="post" class="form-horizontal" style="background-color:#fff;">
<fieldset>
    <legend>&nbsp;新增新闻</legend> 
    <!--
    <div class="control-group">
        <label class="control-label" for="username">用户名</label>
        <div class="controls">
            <input value="<%- item%>" name="username" id="username" class="input-xlarge focused" type="text" placeholder="输入用户名…">
        </div>    
    </div>   
    -->
    
	<div class="control-group">
		<label class="control-label" for="name">名称</label><div class="controls"><input value="" name="name" id="name" class="input-xlarge focused" type="text" placeholder="输入名称…"></div>
	</div>
	<div class="control-group">
		<label class="control-label" for="intro">说明</label><div class="controls"><input value="" name="intro" id="intro" class="input-xlarge focused" type="text" placeholder="输入说明…"></div>
	</div>

    <% if(action == "modify") { %>
    <div class="control-group">
        <label class="control-label" for="createAt">创建日期</label>
        <div class="controls">
            <input value="<%- item.createAt%>" id="createAt" class="input-xlarge  disabled" type="text"  disabled>
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="updateAt">更新日期</label>
        <div class="controls">
            <input value="<%- item.updateAt%>" id="updateAt" class="input-xlarge  disabled" type="text"  disabled>
        </div>
    </div>
    <% } %>

    <div class="form-actions">
        <button type="submit" class="btn btn-primary">保存</button>
        <button class="btn btnCancel" type="button">取消</button>
    </div>
</fieldset>

<input type="hidden" name="_id" value="<%- item._id%>" />
</form>
