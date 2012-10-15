<ul class="breadcrumb">
    <li>
        <a href="<%- url_base%>/news/home">首页</a> <span class="divider">/</span>
    </li>    
    <li class="active">新闻管理</li>     
</ul>

<div class="well mbottom0 list-toobar">
    <form class="form-search mbottom0 mtop0 left" method="get" action="<%- url_base%>/news/list">
          <input type="text" name="keyword" class="input-xlarge search-query" value="<%-keyword%>">
          <button type="submit" class="btn">搜索</button>
    </form>

    <ul class="nav nav-pills right">
        <li><a href="<%- url_base%>/news/create">新增新闻</a></li>        
    </ul>

</div> 


<table class="table table-bordered">
    <thead>
        <tr>
            <th><input type="checkbox" class="cids" /></th>
            
			<th>名称</th>

			<th>说明</th>

            <th>创建时间</th>
            <th>更新时间</th>
            <th>操作</th>
        </tr>
    </thead>
    <tbody>    
        <% items.forEach(function(item, index) {%>
        <tr>
            <td><input type="checkbox" name="cid" value="<%- item._id%>" /></td>
            <!--
            <td><a href="<%- url_base%>/news/modify/<%- item._id%>" title="编辑"><%- item%></a></td>
            --> 
            
			<td><%- item.name%></td>

			<td><%- item.intro%></td>
            
            <td><%- item.createAt%></td>
            <td><%- item.updateAt%></td>
            <td>
                <a href="<%- url_base%>/news/modify/<%- item._id%>" title="编辑"><i class="icon-pencil"></i></a>
                
                <a href="<%- url_base%>/news/remove/<%- item._id%>" class="adelete" title="删除"><i class="icon-remove"></i></a>
            </td>
        </tr>
        <% }); %>

        <% if(items.length == 0){ %>
        <tr><td colspan="6" class="list-no-data">暂无任何相关数据记录...</td></tr>
        <% } %>
    </tbody>
</table>

<% if(items.length > 0){ %>
<div class="btn-group left mtop0">
    <button class="btn btn-small">更多操作</button>
    <button class="btn btn-small dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li><a href="<%- url_base%>/news/bremove/" class="batch-delete">批量删除</a></li>        
    </ul>
</div>

<div class="pagination right mtop0">
    <%- partial("partials/pagination", {page: page, total: total, url: url_base + '/news/list?keyword=' + keyword }) %>     
</div>
<% } %>
