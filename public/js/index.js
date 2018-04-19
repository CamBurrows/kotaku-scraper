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
        data.comment.forEach(function(comment){
          const nickname = comment.nickname
          const time = comment.timestamp
          const body = comment.body

          let col = $("<div class='col m4>'")
          let card = $("<div class='card-panel'")
          card.append($("<h4>" + nickname + "</h4><h5>" + time + "</h5><span>" + body + "</span>"))
          col.append(card)
          $(".comment-container").append(col)
        })
        
      })
      .catch(function(err){
        console.log(err)
      })
    })

    //click handler and ajax post for posting a comment on article
    $(document).on("click",".submit-button", function(){
      let queryurl = "/comment/" + $(this).attr("data-id");
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