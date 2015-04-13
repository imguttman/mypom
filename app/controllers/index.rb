
get '/' do
  erb :index
end

post '/login' do
  @user = User.find_by(username: params[:username])
  if @user && @user.password == params[:password_hash]
    session[:id] = @user.id
    erb :index
  else
    flash[:errors] = "try again"
    erb :index
  end
end

post '/register' do
  @user = User.create(username: params[:username], email: params[:email])
  @user.password = params[:password_hash]
  if @user.save
    session[:id] = @user.id
    erb :index
  else
    flash[:errors] = "try again" #@user.errors.full_messages
    erb :index
  end
end

post '/logout' do
  session[:id] = false
  erb :index
end

get '/:user_id/tasks' do
  erb :_pomlist, layout: false
end

get '/:user_id/task/new' do
  @user = User.find(session[:id])
  erb :_newpom, layout: false
end

post '/:user_id/task/new' do
  @task = Task.create(name:params[:name], category:params[:category], duration:params[:duration], break_duration: params[:break_duration], user_id: session[:id])
  erb :_pomlist, layout: false
end

# delete '/:user_id/task/delete' do
#   erb :_pomlist, layout: false
# end

get '/:task_id/edit' do
  @task = Task.find(params[:task_id])
  @user = @task.user
  erb :_editpom, layout: false
end

put '/:task_id/edit' do
  @task = Task.find(params[:task_id])
  @user = @task.user
  @task.update_attributes({name: params[:name], category:params[:category], duration:params[:duration], break_duration:params[:break_duration], user_id:@user.id})
  erb :_pomlist, layout: false
end

delete '/:task_id/delete' do
  Task.find(params[:task_id]).destroy
  erb :_pomlist, layout: false
end

get '/about' do
end

