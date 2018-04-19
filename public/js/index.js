$(document).ready(function(){
    $('.parallax').parallax();
    $('.modal').modal();

    //click handler and ajax get for viewing comments on article
    $(document).on("click",".comment-view", function(){
      let queryurl = "/comment/" + $(this).attr("data-id");
      console.log(queryurl);
      
      $.ajax({
        method: "GET",
        url: queryurl,
      })
      .then(function(data){
        console.log("comments data: " + data)
        $(".comment-container").empty()
        
        data.comment.forEach(function(comment){
          const nickname = comment.nickname
          const time = comment.timestamp
          const body = comment.body
          console.log("nickname: " + nickname)
          console.log("time: " + time)
          console.log("body: " + body)

          let col = $("<div class='col s3'>")
          let card = $("<div class='card-panel'>")
          card.append($("<h5>" + nickname + "</h5><span>" + time + "<span><p>" + body + "</p>"))
          col.append(card)
          $(".comment-container").append(col)
        })
        
      })
      .then(function(){
        $('#comments-modal').modal('open')
      })
      .catch(function(err){
        console.log(err)
      })
    })

    //click handler for passing hidden data-id attribute into modal form field
    $(document).on("click",".comment-post", function(){
      var dataId = $(this).attr("data-id");
      $("#hidden-info").attr("data-id", dataId)
      console.log("passed id along!")
    })

    //click handler and ajax post for posting a comment on article
    $(document).on("click",".submit-button", function(){
      let queryurl = "/comment/" + $("#hidden-info").attr("data-id");
      console.log(queryurl);
      
      let nickname = $("#nickname").val().trim()
      let body = $("#comment").val().trim()
      
      let newComment = {
          nickname:nickname, 
          body:body
        }
      
      $.ajax({
        method: "POST",
        url: queryurl,
        data: newComment
      })
    })

    //click handler for scrape button
    $(document).on("click",".scrape", function(){
      
      $.ajax({
        method: "GET",
        url: "/scrape",
        success: function(){
          location.reload()
        }
      })
      .catch(function(err){
        console.log(err)
      })
    })

});