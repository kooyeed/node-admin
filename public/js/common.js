$(function() {
    $(".btnCancel").click(function(event) {
        history.go(-1);
    });

    $(".adelete").click(function(event) {
        $('#myModal .modal-body p').html("您确定要删除此记录吗？");
        $('#myModal .params').val($(".adelete").attr('href'));
        $('#myModal').modal();        
        return false;
    });

    $("#myModal .confirm").click(function(event) {
        window.location.href = $('#myModal .params').val();
    });

    $("#myModal .cancel").click(function(event) {
        $('#myModal').modal('hide');
    });

    $(".batch-delete").click(function(event) {
        var url = $(event.target).attr('href');

        var arr = jQuery('input[@type=checkbox][name=cid][checked=checked]');
        var ands = "";
        var len = arr.length;
        if(len == 0) {
            return false;
        }
        for (var i = 0; i < len; i++) {
            url += ands + $(arr[i]).val();
            ands = ",";
        }
        //console.log(url);        
        $('#myModal .modal-body p').html("您确定要删除选择的这些记录吗？");
        $('#myModal .params').val(url);
        $('#myModal').modal();        
        return false;
    });

    $(".cids").click(function(event) {
        jQuery('input[@type=checkbox][name=cid]').attr("checked", !!$(event.target).attr("checked") );
    });
});

