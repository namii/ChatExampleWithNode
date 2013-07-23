# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant::Config.run do |config|
	config.vm.box = "precise64"

	config.vm.provision :chef_solo do |chef|
		chef.cookbooks_path = "~/Chef/cookbooks"
		# vm
		config.vm.provision :shell, :inline => "gem install chef --version 11.4.2 --no-rdoc --no-ri --conservative"
		config.vm.forward_port 3000, 3000
		config.vm.forward_port 80, 1234
		config.vm.forward_port 8080, 1235
		config.vm.forward_port 5858, 5858
		# shared folder
		config.vm.share_folder "host", "~/host", "~" 
		# recipe
		chef.add_recipe "apt"
		chef.add_recipe "build-essential"
		chef.add_recipe "java::openjdk"
		chef.add_recipe "nginx"
		chef.add_recipe "git"
		chef.add_recipe "nodejs"
		chef.add_recipe "vim"

		chef.json = {
			"maven" => {
				"version" => "3"
			}
		}
	end
end
