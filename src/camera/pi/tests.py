import pytest
from . import app

def test_hello_world():
    assert app.index() == "Hello world"
