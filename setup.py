from setuptools import setup, find_packages

data_files = [
    ('share/jupyter/nbextensions/ipyupload', [
        'ipyupload/static/extension.js',
        'ipyupload/static/index.js',
    ]),
    # classic notebook extension
    ('etc/jupyter/nbconfig/notebook.d', [
        'ipyupload/ipyupload.json'
    ]),
]

setup(name='ipyupload',
      version="0.0.1",
      packages=find_packages("."),
      install_requires=['ipywidgets'],
      data_files=data_files,
      include_package_data=True)
