require 'uglifier'
require "jshintrb/jshinttask"
require 'jasmine'
require 'listen'

load 'jasmine/tasks/jasmine.rake'

SOURCE = 'ajax.js'
DOCS_DIR = File.expand_path('../doc', __FILE__)

def minfile
  "#{File.basename(SOURCE, '.js')}.min.js"
end

task default: :watch

desc 'Lint, test, docs, and minify'
task :build => [:test, :lint, :minify, :docs]

task :minify do
  puts 'Minifying...'

  js = File.read(SOURCE)
  ugly = Uglifier.compile(js)

  File.open(minfile, 'w+') do |file|
    file.puts ugly
  end

  puts 'Done.'
end

task :docs do
  puts 'Compiling jsdocs...'
  sh "jsdoc -d #{DOCS_DIR} #{SOURCE}"
  puts 'Done.'
end

desc 'Run tests'
task test: :'jasmine:ci'

desc 'Lint js'
task lint: :jshint

Jshintrb::JshintTask.new :jshint do |t|
  puts 'Linting...'

  t.pattern = SOURCE
  t.options ={
    bitwise: true,
    browser: true,
    camelcase: true,
    curly: true,
    eqeqeq: true,
    forin: true,
    indent: 2,
    immed: true,
    latedef: true,
    noarg: true,
    noempty: true,
    nonew: true,
    quotmark: true,
    regexp: true,
    undef: true,
    strict: true,
    trailing: true,
    undef: true,
    unused: true,
    maxparams: 4,
    maxdepth: 3,
    maxstatements: 10,
    maxlen: 80
  }
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

  FileUtils.rm_r DOCS_DIR
  FileUtils.rm minfile

  puts 'Done.'
end

