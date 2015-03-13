class CreateTasks < ActiveRecord::Migration
  def change

    create_table :tasks do |t|
      t.string :name
      t.string :category
      t.integer :user_id
      t.integer :duration
      t.integer :break_duration
    end
  end

end
