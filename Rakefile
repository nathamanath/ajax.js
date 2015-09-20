require 'uglifier'
require "jshintrb/jshinttask"

load 'jasmine/tasks/jasmine.rake'

SOURCE = 'ajax.js'

def minfile
  "#{File.basename(SOURCE, '.js')}.min.js"
end

desc 'Lint, test, docs, and minify'
task :build => [:lint, :minify]

task :minify do
  puts 'Minifying...'

  js = File.read(SOURCE)
  ugly = Uglifier.compile(js)

  File.open(minfile, 'w+') do |file|
    file.puts ugly
  end

  puts 'Done.'
end

desc 'Lint js'
task lint: :jshint

Jshintrb::JshintTask.new :jshint do |t|
  t.pattern = SOURCE
  t.options = :jshintrc
end

desc 'Run :build on change'
task :watch do
  puts "|  Watching #{SOURCE} for changes."
  puts '|  Hit `ctrl + c` to stop'

  listener = Listen.to SOURCE do
    puts '|  Something changed...'
    sh 'rake build'
  end

  listener.start
  sleep
end

desc 'Remove compiled bits'
task :clean do
  puts 'Cleaning...'

  FileUtils.rm minfile

  puts 'Done.'
end
