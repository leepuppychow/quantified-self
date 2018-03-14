import $ from 'jquery';
import Foo from './foo';

$('#greeting').text(new Foo().greet());
